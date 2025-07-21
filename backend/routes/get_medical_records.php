<?php
require_once '../config/db.php';
header('Content-Type: application/json'); // Set JSON response header

// Ensure the request is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate the patient ID passed as a query parameter
    $patientId = $_GET['patient_id'] ?? null; // Ensure the parameter is `patient_id` (as in the frontend fetch call)

    if (!$patientId) {
        echo json_encode(['success' => false, 'message' => 'Patient ID is required.']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Query the database to get medical_records for the given patient ID
    $stmt = $conn->prepare("SELECT id, notes, prescriptions FROM medical_records WHERE patient_id = ?");
    $stmt->bind_param('i', $patientId);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $medical_records = [];

        while ($row = $result->fetch_assoc()) {
            $medical_records[] = $row;
        }

        // Check if medical_records exist
        if (empty($medical_records)) {
            echo json_encode([
                'success' => true,
                'medical_records' => [],
                'message' => 'No medical_records found for this patient.',
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'medical_records' => $medical_records,
            ]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve medical_records.']);
        http_response_code(500); // Internal Server Error
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405); // Method Not Allowed
}
?>
