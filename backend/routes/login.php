<?php
require_once '../config/db.php';

// Read request body
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
        http_response_code(400);
        exit;
    }

    // Fetch user by email
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error.']);
        http_response_code(500);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if ($user && password_verify($password, $user['password'])) {
        // Start session and store user ID
        session_start();
        $_SESSION['user_id'] = $user['id'];

        echo json_encode(['success' => true, 'message' => 'Login successful!']);
        http_response_code(200);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        http_response_code(401);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>
