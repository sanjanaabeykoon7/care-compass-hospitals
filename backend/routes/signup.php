<?php
require_once '../config/db.php';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Read JSON data from request body
    $inputData = json_decode(file_get_contents('php://input'), true);

    if (!$inputData) {
        echo json_encode(['message' => 'Invalid input data.']);
        http_response_code(400);
        exit;
    }

    // Extract user details
    $fullName = trim($inputData['fullName']);
    $email = trim($inputData['email']);
    $password = trim($inputData['password']);
    $confirmPassword = trim($inputData['confirm-password']);

    // Validation
    if (empty($fullName) || empty($email) || empty($password) || empty($confirmPassword)) {
        echo json_encode(['message' => 'Please fill in all fields.']);
        http_response_code(400);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['message' => 'Invalid email format.']);
        http_response_code(400);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(['message' => 'Passwords do not match.']);
        http_response_code(400);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert user into database
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['message' => 'Database error: Unable to prepare statement.']);
        http_response_code(500);
        exit;
    }

    $stmt->bind_param("sss", $fullName, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Signup successful!']);
        http_response_code(200);
    } else {
        echo json_encode(['message' => 'Error: Unable to register user.']);
        http_response_code(500);
    }

    $stmt->close();
} else {
    echo json_encode(['message' => 'Invalid request method.']);
    http_response_code(405);
}
?>
