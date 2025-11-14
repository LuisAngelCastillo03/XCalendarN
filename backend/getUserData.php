<?php
// /backend/getUserData.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'db.php'; // Asegúrate de conectar con tu BD

if (!isset($_GET['email']) || !isset($_GET['role'])) {
    echo json_encode(['error' => 'Parámetros faltantes']);
    exit;
}

$email = $_GET['email'];
$role = $_GET['role'];
$user = null;

switch ($role) {
    case 'alumno':
        $stmt = $conn->prepare("SELECT nombre, apellido_paterno, apellido_materno FROM alumnos WHERE email = ?");
        break;
    case 'profesor':
        $stmt = $conn->prepare("SELECT nombre, apellido_paterno, apellido_materno FROM profesores WHERE email = ?");
        break;
    case 'administrador':
        $stmt = $conn->prepare("SELECT nombre, apellido_paterno, apellido_materno FROM administrador WHERE email = ?");
        break;
    default:
        echo json_encode(['error' => 'Rol no válido']);
        exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $user = [
        'nombre' => $row['nombre'],
        'apellido_paterno' => $row['apellido_paterno'],
        'apellido_materno' => $row['apellido_materno']
    ];
    echo json_encode($user);
} else {
    echo json_encode(['error' => 'Usuario no encontrado']);
}
