<?php
require_once '../config/db.php'; // Include database connection
header('Content-Type: application/json'); // Set JSON response header

// Ensure request is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate the patient ID passed as a query parameter
    $patientId = $_GET['patient_id'] ?? null; // Ensure the parameter is `patient_id` (as in the frontend fetch call)

    if (!$patientId) {
        echo json_encode(['success' => false, 'message' => 'Patient ID is required.']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Query the database to get appointments for the given patient ID
    $stmt = $conn->prepare("SELECT id, doctor, date, time FROM appointments WHERE patient_id = ?");
    $stmt->bind_param('i', $patientId);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $appointments = [];

        while ($row = $result->fetch_assoc()) {
            $appointments[] = $row;
        }

        // Check if appointments exist
        if (empty($appointments)) {
            echo json_encode([
                'success' => true,
                'appointments' => [],
                'message' => 'No appointments found for this patient.',
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'appointments' => $appointments,
            ]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve appointments.']);
        http_response_code(500); // Internal Server Error
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405); // Method Not Allowed
}
?>
