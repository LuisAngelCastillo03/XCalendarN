<?php
header('Content-Type: application/json');
include 'db.php';

if (!isset($_GET['id'])) {
  echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
  exit;
}

$id = intval($_GET['id']);

$sql = "SELECT id, nombre, apellido_paterno, apellido_materno, matricula, correo, foto_perfil FROM alumnos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  $result = $stmt->get_result();
  if ($result->num_rows > 0) {
    $alumno = $result->fetch_assoc();
    echo json_encode($alumno);
  } else {
    echo json_encode(['success' => false, 'message' => 'Alumno no encontrado']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Error en la consulta']);
}

$stmt->close();
$conn->close();
