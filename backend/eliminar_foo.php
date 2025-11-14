<?php
header('Content-Type: application/json');
include 'db.php';
$data = json_decode(file_get_contents("php://input"),true);

$id  = $data['id'] ?? '';
$rol = $data['rol'] ?? '';
if (!$id || !$rol) {
  echo json_encode(['success'=>false,'message'=>'Faltan datos']); exit;
}

switch ($rol) {
  case 'alumno':       $tabla='alumnos';      $campo='matricula'; break;
  case 'profesor':     $tabla='profesores';   $campo='id'; break;
  case 'administrador':$tabla='administrador';$campo='id'; break;
  default:
    echo json_encode(['success'=>false,'message'=>'Rol inválido']); exit;
}

$stmt = $conn->prepare("SELECT foto_perfil FROM $tabla WHERE $campo=?");
$stmt->bind_param("s",$id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$url = $res['foto_perfil'] ?? '';
if ($url) {
  $file = basename($url);
  @unlink("../uploads/perfiles/".$file);
}

$stmt = $conn->prepare("UPDATE $tabla SET foto_perfil=NULL WHERE $campo=?");
$stmt->bind_param("s",$id);

if ($stmt->execute()) {
  echo json_encode(['success'=>true]);
} else {
  echo json_encode(['success'=>false,'message'=>'Error al eliminar']);
}
?>
