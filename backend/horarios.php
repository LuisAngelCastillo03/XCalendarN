<?php
require_once 'db.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

date_default_timezone_set('America/Mexico_City');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['profesor_id'])) {
        http_response_code(400);
        die(json_encode(['success' => false, 'error' => 'ID de profesor no proporcionado']));
    }

    $profesor_id = intval($_GET['profesor_id']);

    try {
        $stmt = $conn->prepare("
            SELECT id, profesor_id, dia_semana, 
                   TIME_FORMAT(hora_inicio, '%H:%i') as hora_inicio,
                   TIME_FORMAT(hora_fin, '%H:%i') as hora_fin,
                   fecha_inicio, fecha_fin, es_generado 
            FROM horarios_profesor 
            WHERE profesor_id = ?
            ORDER BY dia_semana, hora_inicio
        ");
        $stmt->bind_param("i", $profesor_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $horarios = [];
        while ($row = $result->fetch_assoc()) {
            $start = new DateTime($row['fecha_inicio']);
            $end = new DateTime($row['fecha_fin']);

            $horarios[] = [
                'id' => $row['id'],
                'profesor_id' => $row['profesor_id'],
                'dia_semana' => $row['dia_semana'],
                'hora_inicio' => $row['hora_inicio'],
                'hora_fin' => $row['hora_fin'],
                'start' => $start->format('Y-m-d\TH:i:s'),
                'end' => $end->format('Y-m-d\TH:i:s'),
                'isGenerated' => (bool)$row['es_generado']
            ];
        }
        $stmt->close();

        echo json_encode([
            'success' => true,
            'data' => [
                'workingDays' => array_values(array_unique(array_column($horarios, 'dia_semana'))),
                'workingHours' => [
                    'start' => '09:00',
                    'end' => '18:00'
                ],
                'availability' => $horarios
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['profesor_id']) || !isset($data['availability'])) {
        http_response_code(400);
        die(json_encode(['success' => false, 'error' => 'Datos incompletos']));
    }

    $profesor_id = intval($data['profesor_id']);
    $availability = $data['availability'];

    $conn->begin_transaction();

    try {
        // Eliminar horarios anteriores
        $deleteStmt = $conn->prepare("DELETE FROM horarios_profesor WHERE profesor_id = ?");
        $deleteStmt->bind_param("i", $profesor_id);
        $deleteStmt->execute();
        $deleteStmt->close();

        $insertStmt = $conn->prepare("
            INSERT INTO horarios_profesor
            (profesor_id, dia_semana, hora_inicio, hora_fin, fecha_inicio, fecha_fin, es_generado)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($availability as $slot) {
            $start = new DateTime($slot['start']);
            $end = new DateTime($slot['end']);

            $dia_semana = $start->format('w');
            $hora_inicio = $start->format('H:i');
            $hora_fin = $end->format('H:i');
            $fecha_inicio = $start->format('Y-m-d H:i:s');
            $fecha_fin = $end->format('Y-m-d H:i:s');
            $es_generado = isset($slot['isGenerated']) ? 1 : 0;

            $insertStmt->bind_param(
                "isssssi",
                $profesor_id,
                $dia_semana,
                $hora_inicio,
                $hora_fin,
                $fecha_inicio,
                $fecha_fin,
                $es_generado
            );
            $insertStmt->execute();
        }

        $insertStmt->close();
        $conn->commit();

        echo json_encode(['success' => true, 'message' => 'Horario guardado correctamente']);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>