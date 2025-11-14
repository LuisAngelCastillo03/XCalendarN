<?php
header('Content-Type: application/json');
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

if (!isset($_POST['id']) || !isset($_FILES['foto'])) {
  echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
  exit;
}

$id = intval($_POST['id']);
$foto = $_FILES['foto'];

$nombreArchivo = uniqid() . '_' . basename($foto['name']);
$rutaDestino = '../../uploads/fotos_alumnos/' . $nombreArchivo;

if (!file_exists('../../uploads/fotos_alumnos')) {
  mkdir('../../uploads/fotos_alumnos', 0777, true);
}

if (move_uploaded_file($foto['tmp_name'], $rutaDestino)) {
  $urlRelativa = 'uploads/fotos_alumnos/' . $nombreArchivo;

  $sql = "UPDATE alumnos SET foto_perfil = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("si", $urlRelativa, $id);

  if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Foto actualizada']);
  } else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar en la base de datos']);
  }

  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
}

$conn->close();
