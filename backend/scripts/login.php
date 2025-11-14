<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
 
// Responder OPTIONS para CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}
 
include '../db.php';
 
$input = json_decode(file_get_contents("php://input"), true);
$usuario = $input['usuario'] ?? '';
$contrasena = $input['contrasena'] ?? '';
 
if (!$conn) {
  echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
  exit;
}
 
if (empty($usuario) || empty($contrasena)) {
  echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son obligatorios']);
  exit;
}
 
/**
 * Función para verificar usuario y contraseña
 * Devuelve array con id, nombre y email si es válido, o false si no.
 * Para alumnos devuelve matrícula como id (string)
 * Para profesores y admin devuelve id numérico
 */
function verificarUsuario($tabla, $usuario, $contrasena) {
  global $conn;
 
  if ($tabla === 'alumnos') {
    $sql = "SELECT matricula, nombre, password, email FROM alumnos WHERE matricula = ?";
  } else {
    $sql = "SELECT id, nombre, password, email FROM $tabla WHERE usuario = ?";
  }
 
  $stmt = $conn->prepare($sql);
  if (!$stmt) {
    return false;
  }
 
  $stmt->bind_param("s", $usuario);
  $stmt->execute();
  $stmt->store_result();
 
  if ($stmt->num_rows > 0) {
    if ($tabla === 'alumnos') {
      $stmt->bind_result($identificador, $nombre, $hash, $email);
    } else {
      $stmt->bind_result($id, $nombre, $hash, $email);
    }
    $stmt->fetch();
    $stmt->close();
 
    if (password_verify($contrasena, $hash)) {
      return $tabla === 'alumnos'
        ? ['id' => $identificador, 'nombre' => $nombre, 'email' => $email]
        : ['id' => (int)$id, 'nombre' => $nombre, 'email' => $email];
    }
  } else {
    $stmt->close();
  }
 
  return false;
}
 
$roles = [
  ['tabla' => 'alumnos', 'rol' => 'alumno'],
  ['tabla' => 'profesores', 'rol' => 'profesor'],
  ['tabla' => 'administrador', 'rol' => 'administrador']
];
 
foreach ($roles as $r) {
  $data = verificarUsuario($r['tabla'], $usuario, $contrasena);
  if ($data) {
    $response = [
      'success' => true,
      'id' => $data['id'],
      'nombre' => $data['nombre'],
      'email' => $data['email'],
      'rol' => $r['rol']
    ];
 
    // Agregar matrícula explícitamente si es alumno
    if ($r['rol'] === 'alumno') {
      $response['matricula'] = $data['id'];
    }
 
    echo json_encode($response);
    exit;
  }
}
 
// Si ningún rol coincide
echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);