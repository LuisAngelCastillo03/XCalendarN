<?php
require_once 'db.php';
 
// Configuración de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
 
// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
 
// Obtener y limpiar matrícula
$matricula = filter_input(INPUT_GET, 'matricula', FILTER_SANITIZE_STRING);
$matricula = trim($matricula ?? '');
$matricula_limpia = strtoupper(preg_replace('/[^A-Z0-9]/', '', $matricula));
 
// Validación
if (empty($matricula_limpia)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Matrícula no válida",
        "debug" => [
            "matricula_recibida" => $matricula,
            "matricula_limpia" => $matricula_limpia
        ]
    ]);
    exit;
}
 
try {
    // Consulta SQL con múltiples condiciones de búsqueda
    $sql = "SELECT
                c.id,
                c.matricula,
                c.clientName,
                c.date,
                c.time,
                c.duration,
                c.teacherId,
                c.zoomLink,
                c.zoomCode,
                c.estado,
                DATE_FORMAT(c.date, '%d/%m/%Y') as fecha_formateada,
                DATE_FORMAT(c.time, '%H:%i') as hora_formateada,
                DATE_FORMAT(ADDTIME(c.time, SEC_TO_TIME(c.duration * 60)), '%H:%i') as hora_fin,
                CONCAT_WS(' ', p.nombre, p.apellido_paterno) as nombre_profesor_completo
            FROM clases c
            LEFT JOIN profesores p ON c.teacherId = p.id
            WHERE
                c.matricula = ? OR
                REPLACE(UPPER(c.matricula), ' ', '') = ? OR
                REPLACE(REPLACE(UPPER(c.matricula), ' ', ''), '-', '') = ?
            ORDER BY c.date DESC, c.time DESC";
 
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $matricula, $matricula_limpia, $matricula_limpia);
    $stmt->execute();
    $result = $stmt->get_result();
   
    $clases = $result->fetch_all(MYSQLI_ASSOC);
 
    echo json_encode([
        "success" => true,
        "clases" => $clases,
        "debug" => [
            "matricula_buscada" => $matricula_limpia,
            "query" => $sql,
            "params" => [$matricula, $matricula_limpia, $matricula_limpia]
        ]
    ]);
   
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error en el servidor",
        "details" => $e->getMessage()
    ]);
}
 
$conn->close();
?>