<?php
require_once '../config/db.php';
header("Content-Type: application/json");

// Helper function to send JSON responses
function sendResponse($status, $message, $data = null) {
    echo json_encode([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ]);
    exit();
}

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all lab results
    $sql = "SELECT lr.id, u.full_name AS patient, lr.test_name, lr.test_date, lr.result
            FROM lab_results lr
            JOIN users u ON lr.patient_id = u.id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $labResults = [];
        while ($row = $result->fetch_assoc()) {
            $labResults[] = $row;
        }
        sendResponse("success", "Lab results fetched successfully", $labResults);
    } else {
        sendResponse("success", "No lab results found", []);
    }

} elseif ($method === 'POST') {
    // Add a new lab result
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['patient_id'], $data['test_name'], $data['test_date'], $data['result'])) {
        $patient_id = $conn->real_escape_string($data['patient_id']);
        $test_name = $conn->real_escape_string($data['test_name']);
        $test_date = $conn->real_escape_string($data['test_date']);
        $result = $conn->real_escape_string($data['result']);

        $sql = "INSERT INTO lab_results (patient_id, test_name, test_date, result)
                VALUES ('$patient_id', '$test_name', '$test_date', '$result')";

        if ($conn->query($sql)) {
            sendResponse("success", "Lab result added successfully");
        } else {
            sendResponse("error", "Error adding lab result: " . $conn->error);
        }
    } else {
        sendResponse("error", "Invalid input");
    }

} elseif ($method === 'PUT') {
    // Edit an existing lab result
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['test_name'], $data['test_date'], $data['result'])) {
        $id = $conn->real_escape_string($data['id']);
        $test_name = $conn->real_escape_string($data['test_name']);
        $test_date = $conn->real_escape_string($data['test_date']);
        $result = $conn->real_escape_string($data['result']);

        $sql = "UPDATE lab_results
                SET test_name = '$test_name', test_date = '$test_date', result = '$result'
                WHERE id = '$id'";

        if ($conn->query($sql)) {
            sendResponse("success", "Lab result updated successfully");
        } else {
            sendResponse("error", "Error updating lab result: " . $conn->error);
        }
    } else {
        sendResponse("error", "Invalid input");
    }

} elseif ($method === 'DELETE') {
    // Delete a lab result
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'])) {
        $id = $conn->real_escape_string($data['id']);

        $sql = "DELETE FROM lab_results WHERE id = '$id'";

        if ($conn->query($sql)) {
            sendResponse("success", "Lab result deleted successfully");
        } else {
            sendResponse("error", "Error deleting lab result: " . $conn->error);
        }
    } else {
        sendResponse("error", "Invalid input");
    }

} else {
    sendResponse("error", "Unsupported request method"); // Handle unsupported methods
}

$conn->close();
?>
