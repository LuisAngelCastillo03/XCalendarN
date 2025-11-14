<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php'; // tu conexión mysqli en $conn

$input = json_decode(file_get_contents("php://input"), true);
$usuario = $input['usuario'] ?? '';
$contrasena = $input['contrasena'] ?? '';

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

function verificarUsuario($tabla, $campoUsuario, $campoClave, $campoPassword) {
    global $conn, $usuario, $contrasena;

    $query = "SELECT $campoClave, nombre, apellido_paterno, apellido_materno, $campoPassword FROM $tabla WHERE $campoUsuario = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) return false;

    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $nombre, $apellido_paterno, $apellido_materno, $hash);
        $stmt->fetch();

        if (password_verify($contrasena, $hash)) {
            return [
                'id' => $id,
                'nombre' => $nombre,
                'apellido_paterno' => $apellido_paterno,
                'apellido_materno' => $apellido_materno
            ];
        }
    }
    return false;
}

$roles = [
    ['tabla' => 'alumnos', 'campoUsuario' => 'matricula', 'campoClave' => 'matricula', 'campoPassword' => 'password', 'rol' => 'alumno'],
    ['tabla' => 'profesores', 'campoUsuario' => 'usuario', 'campoClave' => 'id', 'campoPassword' => 'password', 'rol' => 'profesor'],
    ['tabla' => 'administradores', 'campoUsuario' => 'usuario', 'campoClave' => 'id', 'campoPassword' => 'password', 'rol' => 'administrador']
];

foreach ($roles as $r) {
    $data = verificarUsuario($r['tabla'], $r['campoUsuario'], $r['campoClave'], $r['campoPassword']);
    if ($data) {
        echo json_encode([
            'success' => true,
            'id' => $data['id'],
            'nombre' => $data['nombre'] . ' ' . $data['apellido_paterno'] . ' ' . $data['apellido_materno'],
            'rol' => $r['rol']
        ]);
        exit;
    }
}

echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
?>
