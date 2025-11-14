<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../db.php';

$id = $_GET['id'] ?? null;
$rol = $_GET['rol'] ?? null;

if (!$id || !$rol) {
  echo json_encode(['success' => false, 'message' => 'Faltan parámetros']);
  exit;
}

$tabla = '';
$campoId = '';

switch ($rol) {
  case 'alumno':
    $tabla = 'alumnos';
    $campoId = 'matricula';
    break;
  case 'profesor':
    $tabla = 'profesores';
    $campoId = 'id'; // Asumiendo que profesores tienen campo id
    break;
  case 'administrador':
    $tabla = 'administradores';
    $campoId = 'id';
    break;
  default:
    echo json_encode(['success' => false, 'message' => 'Rol inválido']);
    exit;
}

$stmt = $conn->prepare("SELECT nombre, apellido_paterno, apellido_materno, email FROM $tabla WHERE $campoId = ?");
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
  exit;
}

$data = $result->fetch_assoc();

echo json_encode($data);
