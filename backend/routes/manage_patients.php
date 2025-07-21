<?php
require_once '../config/db.php';
header('Content-Type: application/json');
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        // Fetch all patients
        $query = "SELECT * FROM users";
        $result = $conn->query($query);
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode($users);
        break;

    case 'PUT':
        // Update an existing patient
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];
        $full_name = $data['full_name'];
        $email = $data['email'];
        
        $query = "UPDATE users
                  SET full_name='$full_name', email='$email'
                  WHERE id=$id";
        $conn->query($query);

        echo json_encode(['message' => 'Patient updated successfully']);
        break;

    case 'DELETE':
        // Delete a patient
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $query = "DELETE FROM users WHERE id=$id";
        $conn->query($query);

        echo json_encode(['message' => 'Patient deleted successfully']);
        break;

    default:
        echo json_encode(['message' => 'Invalid request']);
        break;
}
?>
