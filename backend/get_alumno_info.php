<?php
header('Content-Type: application/json');
include 'db.php';
 
$matricula = $_GET['matricula'] ?? '';
 
if (!$matricula) {
  echo json_encode(['success' => false, 'message' => 'Matrícula requerida']);
  exit;
}
 
$sql = "SELECT matricula, nombre, email, estado, fecha_registro, foto_perfil FROM alumnos WHERE matricula = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $matricula);
$stmt->execute();
 
$result = $stmt->get_result();
if ($result->num_rows > 0) {
  echo json_encode($result->fetch_assoc());
} else {
  echo json_encode(['success' => false, 'message' => 'Alumno no encontrado']);
}