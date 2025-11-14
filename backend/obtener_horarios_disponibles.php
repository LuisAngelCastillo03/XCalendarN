<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$profesor_id = $_GET['profesor_id'] ?? null;
$fecha = $_GET['fecha'] ?? null;

if (!$profesor_id || !$fecha) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros"]);
    exit;
}

$dia_semana = date('w', strtotime($fecha)); // 0=Domingo ... 6=Sábado
$hora_disponible = [];
$ocupadas = [];
$intervalo = 30; // minutos

// Obtener los rangos de trabajo del profesor en ese día
$sql = "SELECT hora_inicio, hora_fin 
        FROM horarios_profesor 
        WHERE profesor_id = ? 
        AND dia_semana = ? 
        AND ? BETWEEN DATE(fecha_inicio) AND DATE(fecha_fin)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $profesor_id, $dia_semana, $fecha);
$stmt->execute();
$result = $stmt->get_result();

$rangos = [];
while ($r = $result->fetch_assoc()) {
    $rangos[] = $r;
}

if (empty($rangos)) {
    echo json_encode([]); // No trabaja ese día
    exit;
}

// Obtener clases agendadas del profesor ese día
$sql2 = "SELECT time, duration 
         FROM clases 
         WHERE teacherId = ? AND date = ? AND estado = 'agendada'";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("is", $profesor_id, $fecha);
$stmt2->execute();
$result2 = $stmt2->get_result();

while ($row = $result2->fetch_assoc()) {
    $inicio = strtotime($row['time']);
    $fin = $inicio + ($row['duration'] * 60);
    for ($i = $inicio; $i < $fin; $i += 60) {
        $ocupadas[] = date('H:i', $i);
    }
}

// Generar slots disponibles por rango
foreach ($rangos as $row) {
    $start = strtotime($row['hora_inicio']);
    $end = strtotime($row['hora_fin']);

    for ($i = $start; $i + ($intervalo * 60) <= $end; $i += ($intervalo * 60)) {
        $hora_slot = date('H:i', $i);
        if (!in_array($hora_slot, $ocupadas)) {
            $hora_disponible[] = $hora_slot;
        }
    }
}

echo json_encode($hora_disponible);