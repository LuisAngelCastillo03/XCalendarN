<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../db.php';

$profesorId = isset($_GET['profesorId']) ? intval($_GET['profesorId']) : 0;

if (!$conn) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

if ($profesorId <= 0) {
    echo json_encode(['error' => 'ID de profesor inválido']);
    exit;
}

// Definimos el rango de tiempo para "próximas clases", por ejemplo, las próximas 48 horas
$now = date('Y-m-d H:i:s');
$limitTime = date('Y-m-d H:i:s', strtotime('+48 hours'));

$sql = "SELECT c.id, c.date, c.time, c.duration, a.nombre AS alumnoNombre
        FROM clases c
        LEFT JOIN alumnos a ON c.matricula = a.matricula
        WHERE c.teacherId = ? 
          AND c.estado = 'agendada'
          AND CONCAT(c.date, ' ', c.time) BETWEEN ? AND ?
        ORDER BY c.date, c.time ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param('iss', $profesorId, $now, $limitTime);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];

while ($row = $result->fetch_assoc()) {
    $startDateTime = $row['date'] . ' ' . $row['time'];
    $formattedDateTime = date('l, d \d\e F \d\e Y, h:i a', strtotime($startDateTime));

    $notifications[] = [
        'id' => $row['id'],
        'message' => "Tienes clase con el alumno {$row['alumnoNombre']} el {$formattedDateTime}.",
        'read' => false, // Aquí podrías integrar una tabla para notificaciones leídas si quieres
    ];
}

echo json_encode($notifications);
