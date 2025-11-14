<?php
header('Content-Type: application/json');

require_once 'scripts/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$rol = $_POST['rol'] ?? '';
$id = $_POST['id'] ?? '';
$matricula = $_POST['matricula'] ?? '';
$foto = $_FILES['foto'] ?? null;

if (!$foto || $foto['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No se subió ninguna foto o hubo un error al subirla.']);
    exit;
}

// Validar rol
if (!in_array($rol, ['alumno', 'profesor', 'administrador'])) {
    echo json_encode(['success' => false, 'message' => 'Rol no válido']);
    exit;
}

// Determinar carpeta y datos de identificación
switch ($rol) {
    case 'alumno':
        $tabla = 'alumnos';
        $campo_id = 'matricula';
        $valor_id = $matricula;
        $carpeta_destino = '../fotos/alumnos/';
        break;
    case 'profesor':
        $tabla = 'profesores';
        $campo_id = 'id';
        $valor_id = $id;
        $carpeta_destino = '../fotos/profesores/';
        break;
    case 'administrador':
        $tabla = 'administrador';
        $campo_id = 'id';
        $valor_id = $id;
        $carpeta_destino = '../fotos/administrador/';
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Rol desconocido']);
        exit;
}

// Crear carpeta si no existe
if (!file_exists($carpeta_destino)) {
    mkdir($carpeta_destino, 0777, true);
}

// Generar nombre de archivo único
$extension = pathinfo($foto['name'], PATHINFO_EXTENSION);
$nombre_archivo = strtolower("{$tabla}_{$valor_id}_" . time() . "." . $extension);
$ruta_foto = $carpeta_destino . $nombre_archivo;

// Mover archivo subido
if (!move_uploaded_file($foto['tmp_name'], $ruta_foto)) {
    echo json_encode(['success' => false, 'message' => 'No se pudo guardar la imagen.']);
    exit;
}

// Construir ruta pública (URL relativa para frontend)
$ruta_publica = "http://localhost/modulo_agenda/fotos/" . basename($carpeta_destino) . "/" . $nombre_archivo;

// Actualizar base de datos
$stmt = $conn->prepare("UPDATE $tabla SET foto_perfil = ? WHERE $campo_id = ?");
$stmt->bind_param("ss", $ruta_publica, $valor_id);
$success = $stmt->execute();
$stmt->close();

if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Foto actualizada correctamente',
        'foto_url' => $ruta_publica
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar la base de datos'
    ]);
}
