<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Incluir archivo de conexión a la base de datos
include '../db.php';

// Obtener matrícula del alumno
$matricula = isset($_GET['matricula']) ? $conn->real_escape_string($_GET['matricula']) : '';

// Verificar conexión a la base de datos
if (!$conn) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

// Validar matrícula
if (empty($matricula)) {
    echo json_encode(['error' => 'Matrícula inválida']);
    exit;
}

// Definir rango de tiempo (próximas 48 horas)
$now = date('Y-m-d H:i:s');
$limitTime = date('Y-m-d H:i:s', strtotime('+48 hours'));

// Consulta para obtener clases próximas del alumno
$sql = "SELECT 
            c.id, 
            c.date, 
            c.time, 
            c.duration,
            CONCAT(p.nombre, ' ', p.apellido_paterno) AS nombre_profesor
        FROM clases c
        INNER JOIN profesores p ON c.teacherId = p.id
        WHERE 
            c.matricula = ? 
            AND c.estado = 'agendada'
            AND CONCAT(c.date, ' ', c.time) BETWEEN ? AND ?
        ORDER BY c.date ASC, c.time ASC";

// Preparar y ejecutar consulta
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit;
}

$stmt->bind_param('sss', $matricula, $now, $limitTime);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];

// Formatear resultados
while ($row = $result->fetch_assoc()) {
    // Formatear fecha y hora
    $startDateTime = $row['date'] . ' ' . $row['time'];
    $formattedDate = date('d/m/Y', strtotime($row['date']));
    $formattedTime = date('H:i', strtotime($row['time']));
    
    // Calcular hora de fin
    $endTime = date('H:i', strtotime($row['time'] . ' + ' . $row['duration'] . ' minutes'));
    
    // Crear mensaje de notificación
    $message = "Tienes clase con el profesor {$row['nombre_profesor']} " .
               "el {$formattedDate} de {$formattedTime} a {$endTime} " .
               "({$row['duration']} minutos)";
    
    $notifications[] = [
        'id' => $row['id'],
        'message' => $message,
        'date' => $now,
        'read' => false
    ];
}

// Si no hay clases próximas
if (empty($notifications)) {
    $notifications[] = [
        'id' => 0,
        'message' => 'No tienes clases programadas en las próximas 48 horas',
        'date' => $now,
        'read' => false
    ];
}

// Devolver respuesta JSON
echo json_encode($notifications);

// Cerrar conexiones
$stmt->close();
$conn->close();
?>