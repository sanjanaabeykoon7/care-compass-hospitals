<?php
require_once '../config/db.php';
header('Content-Type: application/json'); // Set JSON response header

// Ensure the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Validate input
    $patientId = $inputData['user_id'] ?? null; // Ensure `user_id` matches the frontend naming convention
    $doctor = trim($inputData['doctor'] ?? '');
    $date = trim($inputData['date'] ?? '');
    $time = trim($inputData['time'] ?? '');

    // Check for required fields
    if (!$patientId || empty($doctor) || empty($date) || empty($time)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Validate date and time format (e.g., YYYY-MM-DD for date, HH:MM for time)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
        echo json_encode(['success' => false, 'message' => 'Invalid date or time format.']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Insert appointment into the database
    $stmt = $conn->prepare("INSERT INTO appointments (patient_id, doctor, date, time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('isss', $patientId, $doctor, $date, $time);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Appointment scheduled successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to schedule appointment.']);
        http_response_code(500); // Internal Server Error
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405); // Method Not Allowed
}
?>
