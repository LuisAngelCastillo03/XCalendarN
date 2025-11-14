<?php
require_once 'db.php';

// Establecer zona horaria para evitar problemas con strtotime y time()
date_default_timezone_set('America/Mexico_City');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Datos no válidos."]);
    exit;
}

// ✅ CANCELAR CLASE
if (isset($data["cancelar"]) && $data["cancelar"] === true && isset($data["id"])) {
    $id = intval($data["id"]);

    $stmt = $conn->prepare("SELECT date, time FROM clases WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $clase = $result->fetch_assoc();

    if (!$clase) {
        echo json_encode(["success" => false, "error" => "Clase no encontrada."]);
        exit;
    }

    $fechaHoraClase = strtotime($clase["date"] . ' ' . $clase["time"]);
    $ahora = time();

    // Comparar tiempos correctamente con la zona horaria configurada
    if (($fechaHoraClase - $ahora) <= 1800) {
        echo json_encode(["success" => false, "error" => "No se puede cancelar la clase faltando menos de 30 minutos."]);
        exit;
    }

    $update = $conn->prepare("UPDATE clases SET estado = 'cancelada' WHERE id = ?");
    $update->bind_param("i", $id);
    if ($update->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al cancelar la clase."]);
    }
    exit;
}

// ✅ GUARDAR NUEVA CLASE
$matricula = $data["matricula"] ?? '';
$clientName = $data["clientName"] ?? '';
$date = $data["date"] ?? '';
$time = $data["time"] ?? '';
$duration = isset($data["duration"]) ? intval($data["duration"]) : 0;
$teacherId = isset($data["teacherId"]) ? intval($data["teacherId"]) : 0;

if (!$matricula || !$clientName || !$date || !$time || !$duration || !$teacherId) {
    echo json_encode(["success" => false, "error" => "Faltan datos obligatorios."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO clases (matricula, clientName, date, time, duration, teacherId, estado)
                        VALUES (?, ?, ?, ?, ?, ?, 'agendada')");
$stmt->bind_param("ssssii", $matricula, $clientName, $date, $time, $duration, $teacherId);

if ($stmt->execute()) {
    $id = $stmt->insert_id;
    echo json_encode(["success" => true, "id" => $id]);
} else {
    echo json_encode(["success" => false, "error" => "Error al guardar clase."]);
}
?>