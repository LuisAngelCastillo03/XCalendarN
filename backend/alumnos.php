<?php
// Configuración inicial (debe ser lo primero en el archivo)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
require_once 'db.php';

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Obtener datos JSON de entrada
$jsonInput = file_get_contents("php://input");
$data = [];
if ($jsonInput !== false) {
    $data = json_decode($jsonInput, true) ?? [];
}

try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Parámetros de filtro
            $matricula = $_GET['matricula'] ?? null;
            $nombre = $_GET['nombre'] ?? null;
            
            // Construir consulta SQL con filtros
            $sql = "SELECT * FROM alumnos WHERE 1=1";
            $params = [];
            $types = "";
            
            if ($matricula !== null && $matricula !== '') {
                $sql .= " AND matricula LIKE ?";
                $params[] = "%$matricula%";
                $types .= "s";
            }
            
            if ($nombre !== null && $nombre !== '') {
                $sql .= " AND (nombre LIKE ? OR apellido_paterno LIKE ? OR apellido_materno LIKE ?)";
                $params[] = "%$nombre%";
                $params[] = "%$nombre%";
                $params[] = "%$nombre%";
                $types .= "sss";
            }
            
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception("Error al preparar consulta: " . $conn->error);
            }
            
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }
            
            if (!$stmt->execute()) {
                throw new Exception("Error al ejecutar consulta: " . $stmt->error);
            }
            
            $result = $stmt->get_result();
            $alumnos = $result->fetch_all(MYSQLI_ASSOC);
            
            echo json_encode(["success" => true, "data" => $alumnos]);
            break;

        case 'POST':
            // Validar campos requeridos
            $required = ['matricula', 'nombre', 'apellido_paterno', 'email', 'password'];
            foreach ($required as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    throw new Exception("El campo $field es requerido");
                }
            }
            
            // Validar formato de email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("El email proporcionado no es válido");
            }
            
            // Encriptar contraseña
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO alumnos 
                (matricula, nombre, apellido_paterno, apellido_materno, email, password, estado, fecha_registro)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
                
            if ($stmt === false) {
                throw new Exception("Error al preparar consulta: " . $conn->error);
            }
            
            $estado = $data['estado'] ?? 'activo';
            $apellidoMaterno = $data['apellido_materno'] ?? '';
            
            $stmt->bind_param("sssssss", 
                $data['matricula'],
                $data['nombre'],
                $data['apellido_paterno'],
                $apellidoMaterno,
                $data['email'],
                $hashedPassword,
                $estado
            );
            
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "data" => $data]);
            } else {
                throw new Exception("Error al crear alumno: " . $stmt->error);
            }
            break;

        case 'PUT':
            if (!isset($_GET['matricula']) || empty($_GET['matricula'])) {
                throw new Exception("Matrícula requerida para actualización");
            }
            
            $matricula = $_GET['matricula'];
            $updatePassword = isset($data['password']) && !empty(trim($data['password']));
            
            // Construir consulta dinámica
            $sql = "UPDATE alumnos SET nombre=?, apellido_paterno=?, apellido_materno=?, email=?, estado=?";
            $types = "sssss";
            $params = [
                $data['nombre'] ?? '',
                $data['apellido_paterno'] ?? '',
                $data['apellido_materno'] ?? '',
                $data['email'] ?? '',
                $data['estado'] ?? 'activo'
            ];
            
            if ($updatePassword) {
                $sql .= ", password=?";
                $types .= "s";
                $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            
            $sql .= " WHERE matricula=?";
            $types .= "s";
            $params[] = $matricula;
            
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception("Error al preparar consulta: " . $conn->error);
            }
            
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Error al actualizar alumno: " . $stmt->error);
            }
            break;

        case 'DELETE':
            if (!isset($_GET['matricula']) || empty($_GET['matricula'])) {
                throw new Exception("Matrícula requerida para eliminación");
            }
            
            $matricula = $_GET['matricula'];
            $stmt = $conn->prepare("DELETE FROM alumnos WHERE matricula=?");
            
            if ($stmt === false) {
                throw new Exception("Error al preparar consulta: " . $conn->error);
            }
            
            $stmt->bind_param("s", $matricula);
            
            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Error al eliminar alumno: " . $stmt->error);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["success" => false, "error" => "Método no permitido"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

$conn->close();
?>