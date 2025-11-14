<?php
include __DIR__ . '/../db.php';

$usuario = "A384090";  // tu usuario
$contrasena = "Test1234"; // contraseña en texto plano

$stmt = $conn->prepare("SELECT password FROM alumnos WHERE matricula = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hash);
    $stmt->fetch();
    echo "Hash en BD: " . $hash . "\n";
    if (password_verify($contrasena, $hash)) {
        echo "Contraseña correcta";
    } else {
        echo "Contraseña incorrecta";
    }
} else {
    echo "Usuario no encontrado";
}
?>
