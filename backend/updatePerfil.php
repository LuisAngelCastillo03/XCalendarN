<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos."]);
    exit;
}

$classId = $data['id'];
$status = $data['status'];

// 1️⃣ Verificamos que la clase exista
$query = $conn->prepare("SELECT matricula FROM clases WHERE id = ?");
$query->bind_param("i", $classId);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Clase no encontrada."]);
    exit;
}

$row = $result->fetch_assoc();
$matricula = $row['matricula'];

// 2️⃣ Actualizamos el estado de la clase
$update = $conn->prepare("UPDATE clases SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?");
$update->bind_param("si", $status, $classId);
$updateSuccess = $update->execute();

if (!$updateSuccess) {
    echo json_encode(["success" => false, "error" => "Error al actualizar clase."]);
    exit;
}

// 3️⃣ Insertamos una notificación para el alumno
$mensaje = ($status === 'aceptada') 
    ? "Tu clase ha sido aceptada por el profesor." 
    : (($status === 'cancelada') ? "Tu clase ha sido cancelada por el profesor." : "Actualización en tu clase.");

$notif = $conn->prepare("INSERT INTO notificaciones (matricula, message, fecha, leida) VALUES (?, ?, NOW(), 0)");
$notif->bind_param("ss", $matricula, $mensaje);
$notif->execute();

echo json_encode(["success" => true, "message" => "Clase actualizada y notificación enviada."]);
?>