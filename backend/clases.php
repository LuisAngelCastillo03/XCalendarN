<?php
require_once 'db.php';
 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
 
// Obtener el parámetro de matrícula si existe
$matricula = isset($_GET['matricula']) ? $_GET['matricula'] : null;
 
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT c.id, c.matricula, c.clientName, c.date, c.time, c.duration, c.teacherId, p.nombre AS teacherName
              FROM clases c
              LEFT JOIN profesores p ON c.teacherId = p.id
              WHERE c.estado = 'agendada'";
   
    // Si hay matrícula, filtrar por ella
    if ($matricula) {
        $query .= " AND c.matricula = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $matricula);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }
 
    $clases = [];
 
    while ($row = $result->fetch_assoc()) {
        $clases[] = [
            "id" => $row["id"],
            "matricula" => $row["matricula"],
            "clientName" => $row["clientName"],
            "date" => $row["date"],
            "time" => $row["time"],
            "duration" => intval($row["duration"]),
            "teacherId" => intval($row["teacherId"]),
            "teacherName" => $row["teacherName"] ?? null
        ];
    }
 
    echo json_encode(["success" => true, "data" => $clases]);
    exit;
}
?>