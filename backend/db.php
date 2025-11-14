<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "xshedule";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    error_log("Error de conexión a MySQL: " . $conn->connect_error);
    header('Content-Type: application/json');
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos'
    ]));
}

// Configurar charset
$conn->set_charset("utf8mb4");
?>