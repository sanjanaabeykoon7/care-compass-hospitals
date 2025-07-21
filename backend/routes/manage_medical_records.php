<?php
require_once '../config/db.php';

// Parse incoming request
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

if ($method === 'GET') {
    // Fetch all medical records
    $query = "
        SELECT mr.id, u.full_name AS patient, u.id AS patient_id, mr.notes, mr.prescriptions 
        FROM medical_records AS mr 
        JOIN users AS u ON mr.patient_id = u.id
    ";

    $result = $conn->query($query);
    if ($result) {
        $records = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "data" => $records]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }

} elseif ($method === 'POST') {
    // Add a new medical record
    if (!isset($input['patient_id'], $input['notes'], $input['prescriptions'])) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO medical_records (patient_id, notes, prescriptions) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $input['patient_id'], $input['notes'], $input['prescriptions']);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Medical record added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'PUT') {
    // Update an existing medical record
    if (!isset($input['id'], $input['notes'], $input['prescriptions'])) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE medical_records SET notes = ?, prescriptions = ? WHERE id = ?");
    $stmt->bind_param("ssi", $input['notes'], $input['prescriptions'], $input['id']);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Medical record updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'DELETE') {
    // Delete a medical record
    if (!isset($input['id'])) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM medical_records WHERE id = ?");
    $stmt->bind_param("i", $input['id']);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Medical record deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();

} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
?>
