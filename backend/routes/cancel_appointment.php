<?php
require_once '../config/db.php';

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Validate input
    $appointmentId = $inputData['id'] ?? null;

    if (!$appointmentId) {
        echo json_encode(['success' => false, 'message' => 'Appointment ID is required.']);
        http_response_code(400);
        exit;
    }

    // Delete appointment from database
    $stmt = $conn->prepare("DELETE FROM appointments WHERE id = ?");
    $stmt->bind_param('i', $appointmentId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Appointment canceled successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to cancel appointment.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>
