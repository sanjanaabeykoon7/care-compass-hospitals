<?php
require_once '../config/db.php';
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

    // Query the database to get lab results for the given patient ID
    $stmt = $conn->prepare("SELECT id, test_name, test_date, result FROM lab_results WHERE patient_id = ?");
    $stmt->bind_param('i', $patientId);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $lab_results = [];

        while ($row = $result->fetch_assoc()) {
            $lab_results[] = $row;
        }

        // Check if lab_results exist
        if (empty($lab_results)) {
            echo json_encode([
                'success' => true,
                'lab_results' => [],
                'message' => 'No lab results found for this patient.',
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'lab_results' => $lab_results,
            ]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve lab results.']);
        http_response_code(500); // Internal Server Error
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405); // Method Not Allowed
}
?>
