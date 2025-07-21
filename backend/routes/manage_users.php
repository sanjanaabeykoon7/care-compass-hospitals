<?php
require_once '../config/db.php';
header('Content-Type: application/json'); // Set headers for JSON response
$method = $_SERVER['REQUEST_METHOD']; // Determine the request method

// Handle the request
switch ($method) {
    case 'GET': // Fetch all admin/staff members
        $sql = "SELECT id, full_name, email, role FROM admin_staff";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            echo json_encode(["status" => "success", "data" => []]);
        }
        break;

    case 'POST': // Add a new admin/staff
        $data = json_decode(file_get_contents("php://input"), true);
        $full_name = $conn->real_escape_string($data['full_name']);
        $email = $conn->real_escape_string($data['email']);
        $password = password_hash($data['password'], PASSWORD_BCRYPT); // Encrypt password
        $role = $conn->real_escape_string($data['role']);

        $sql = "INSERT INTO admin_staff (full_name, email, password, role) VALUES ('$full_name', '$email', '$password', '$role')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "User added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
        }
        break;

    case 'PUT': // Edit an admin/staff account
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $conn->real_escape_string($data['id']);
        $full_name = $conn->real_escape_string($data['full_name']);
        $email = $conn->real_escape_string($data['email']);
        $role = $conn->real_escape_string($data['role']);

        $sql = "UPDATE admin_staff SET full_name='$full_name', email='$email', role='$role' WHERE id='$id'";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "User updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
        }
        break;

    case 'DELETE': // Delete an admin/staff account
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $conn->real_escape_string($data['id']);

        $sql = "DELETE FROM admin_staff WHERE id='$id'";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "User deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
