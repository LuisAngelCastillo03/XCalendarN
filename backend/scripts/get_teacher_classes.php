<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require __DIR__ . '/../db.php';

if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $conn->connect_error]);
    exit;
}

$profesorId = isset($_GET['profesorId']) ? intval($_GET['profesorId']) : 0;

if ($profesorId <= 0) {
    echo json_encode(['error' => 'ID de profesor inválido']);
    exit;
}

try {
    $sql = "
        SELECT 
            c.id,
            c.date,
            c.time,
            c.duration,
            a.nombre AS alumno_nombre
        FROM clases c
        LEFT JOIN alumnos a ON c.matricula = a.matricula
        WHERE 
            c.teacherId = ? 
            AND c.estado = 'agendada'
            AND CONCAT(c.date, ' ', c.time) > NOW()
        ORDER BY c.date, c.time
    ";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error en preparación: " . $conn->error);
    }

    $stmt->bind_param("i", $profesorId);
    $stmt->execute();

    $result = $stmt->get_result();
    $clases = $result->fetch_all(MYSQLI_ASSOC);

    $output = array_map(function($clase) {
        return [
            'id' => $clase['id'],
            'title' => 'Clase con ' . ($clase['alumno_nombre'] ?? 'Alumno'),
            'start' => $clase['date'] . 'T' . $clase['time'],
            'details' => [
                'nombre' => $clase['alumno_nombre'] ?? 'No disponible',
                'duracion' => $clase['duration'] . ' min'
            ]
        ];
    }, $clases);

    echo json_encode($output);
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
