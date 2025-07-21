<?php
require_once '../config/db.php';
header('Content-Type: application/json');
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        // Fetch all payments
        $query = "SELECT * FROM payments";
        $result = $conn->query($query);
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        echo json_encode($payments);
        break;

    case 'DELETE':
        // Delete a payment
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $query = "DELETE FROM payments WHERE id=$id";
        $conn->query($query);

        echo json_encode(['message' => 'Payment deleted successfully']);
        break;

    default:
        echo json_encode(['message' => 'Invalid request']);
        break;
}
?>
