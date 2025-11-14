<?php
// Configuración de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');
 
// Configuración de CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// Manejo de solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
 
// Función para enviar respuestas JSON
function sendResponse($success, $data = null, $error = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'error' => $error
    ]);
    exit;
}
 
// Función para generar nombre de usuario
function generarUsuario($nombre, $apellido) {
    $randomNum = rand(10, 99);
    return strtolower(substr($nombre, 0, 1) . $apellido . $randomNum);
}
 
// Función para generar contraseña (texto plano)
function generarPassword() {
    return substr(md5(uniqid(rand(), true)), 0, 8);
}
 
// Conexión a la base de datos
require_once 'db.php';
 
try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $_GET['id'] ?? null;
    $nombreFiltro = $_GET['nombre'] ?? null;
 
    switch ($method) {
        case 'GET':
            $query = "SELECT * FROM profesores WHERE 1=1";
            $params = [];
            $types = "";
           
            if ($id) {
                $query .= " AND id = ?";
                $params[] = $id;
                $types .= "i";
            }
           
            if ($nombreFiltro) {
                $query .= " AND (nombre LIKE ? OR apellido_paterno LIKE ? OR apellido_materno LIKE ?)";
                $searchTerm = "%$nombreFiltro%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $types .= "sss";
            }
           
            $stmt = $conn->prepare($query);
           
            if ($params) {
                $stmt->bind_param($types, ...$params);
            }
           
            if (!$stmt->execute()) {
                sendResponse(false, null, 'Error al ejecutar consulta: ' . $stmt->error, 500);
            }
           
            $result = $stmt->get_result();
            $profesores = $result->fetch_all(MYSQLI_ASSOC);
 
            $profesores = array_map(function($p) {
                return [
                    'id' => $p['id'],
                    'nombre' => $p['nombre'],
                    'apellidoPaterno' => $p['apellido_paterno'],
                    'apellidoMaterno' => $p['apellido_materno'],
                    'fechaNacimiento' => $p['fecha_nacimiento'] === '0000-00-00' ? null : $p['fecha_nacimiento'],
                    'email' => $p['email'],
                    'telefono' => $p['telefono'],
                    'pais' => $p['pais'],
                    'ciudad' => $p['ciudad'],
                    'fotoPerfil' => $p['foto_perfil'],
                    'usuario' => $p['usuario'],
                    'password' => $p['password']
                ];
            }, $profesores);
 
            sendResponse(true, $profesores);
            break;
 
        case 'POST':
            if (empty($input)) {
                sendResponse(false, null, 'Datos requeridos', 400);
            }
 
            $required = ['nombre', 'apellidoPaterno', 'email'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    sendResponse(false, null, "Campo $field es requerido", 400);
                }
            }
 
            $nombre = trim($input['nombre']);
            $apellidoPaterno = trim($input['apellidoPaterno']);
            $apellidoMaterno = trim($input['apellidoMaterno'] ?? '');
            $fechaNacimiento = $input['fechaNacimiento'] ?? null;
            $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
            $telefono = preg_replace('/[^0-9]/', '', $input['telefono'] ?? '');
            $pais = trim($input['pais'] ?? 'México');
            $ciudad = trim($input['ciudad'] ?? '');
            $usuario = trim($input['usuario'] ?? generarUsuario($nombre, $apellidoPaterno));
 
            $passwordPlano = trim($input['password'] ?? generarPassword());
            $passwordHasheada = password_hash($passwordPlano, PASSWORD_DEFAULT);
 
            if (!$email) {
                sendResponse(false, null, 'Email inválido', 400);
            }
 
            $stmt = $conn->prepare("INSERT INTO profesores
                (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, telefono, pais, ciudad, usuario, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
 
            if (!$stmt) {
                sendResponse(false, null, 'Error al preparar consulta: ' . $conn->error, 500);
            }
 
            $stmt->bind_param("ssssssssss",
                $nombre, $apellidoPaterno, $apellidoMaterno, $fechaNacimiento,
                $email, $telefono, $pais, $ciudad, $usuario, $passwordHasheada);
 
            if ($stmt->execute()) {
                $newId = $conn->insert_id;
                sendResponse(true, [
                    'id' => $newId,
                    'usuario' => $usuario,
                    'password' => $passwordPlano
                ]);
            } else {
                sendResponse(false, null, 'Error al crear profesor: ' . $stmt->error, 500);
            }
            break;
 
        case 'PUT':
            if (!$id) {
                sendResponse(false, null, 'ID requerido para actualizar', 400);
            }
 
            if (empty($input)) {
                sendResponse(false, null, 'Datos requeridos para actualización', 400);
            }
 
            $fieldMap = [
                'nombre' => 'nombre',
                'apellidoPaterno' => 'apellido_paterno',
                'apellidoMaterno' => 'apellido_materno',
                'fechaNacimiento' => 'fecha_nacimiento',
                'email' => 'email',
                'telefono' => 'telefono',
                'pais' => 'pais',
                'ciudad' => 'ciudad'
            ];
 
            $updates = [];
            $params = [];
            $types = '';
 
            foreach ($fieldMap as $frontField => $dbField) {
                if (isset($input[$frontField])) {
                    $updates[] = "$dbField = ?";
                    $params[] = $input[$frontField];
                    $types .= 's';
                }
            }
 
            if (empty($updates)) {
                sendResponse(false, null, 'No hay campos válidos para actualizar', 400);
            }
 
            $params[] = $id;
            $types .= 'i';
 
            $query = "UPDATE profesores SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $conn->prepare($query);
 
            if (!$stmt) {
                sendResponse(false, null, 'Error al preparar consulta: ' . $conn->error, 500);
            }
 
            $stmt->bind_param($types, ...$params);
 
            if ($stmt->execute()) {
                sendResponse(true, ['message' => 'Profesor actualizado']);
            } else {
                sendResponse(false, null, 'Error al actualizar profesor: ' . $stmt->error, 500);
            }
            break;
 
        case 'DELETE':
            if (!$id) {
                sendResponse(false, null, 'ID requerido para eliminar', 400);
            }
 
            $stmt = $conn->prepare("DELETE FROM profesores WHERE id = ?");
            if (!$stmt) {
                sendResponse(false, null, 'Error al preparar consulta: ' . $conn->error, 500);
            }
 
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                sendResponse(true, ['message' => 'Profesor eliminado']);
            } else {
                sendResponse(false, null, 'Error al eliminar profesor: ' . $stmt->error, 500);
            }
            break;
 
        default:
            sendResponse(false, null, 'Método no permitido', 405);
    }
} catch (Exception $e) {
    error_log('Error en profesores.php: ' . $e->getMessage());
    sendResponse(false, null, 'Error interno del servidor', 500);
}
?>