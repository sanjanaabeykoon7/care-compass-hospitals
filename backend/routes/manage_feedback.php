<?php
require_once '../config/db.php';

header('Content-Type: application/json');
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        // Fetch all feedbacks
        $query = "SELECT * FROM feedback_queries";
        $result = $conn->query($query);
        $feedbackQueries = [];
        while ($row = $result->fetch_assoc()) {
            $feedbackQueries[] = $row;
        }
        echo json_encode($feedbackQueries);
        break;

    case 'DELETE':
        // Delete a feedback
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $query = "DELETE FROM feedback_queries WHERE id=$id";
        $conn->query($query);

        echo json_encode(['message' => 'Feedback/Query deleted successfully']);
        break;

    default:
        echo json_encode(['message' => 'Invalid request']);
        break;
}
?>
