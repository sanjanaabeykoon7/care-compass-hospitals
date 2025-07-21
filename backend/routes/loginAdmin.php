<?php
require_once "../config/db.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please provide both email and password.']);
        http_response_code(400);
        exit;
    }

    // Fetch user by email from admin_staff table
    $stmt = $conn->prepare("SELECT * FROM admin_staff WHERE email = ?");
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
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
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['full_name'] = $user['full_name'];

        if ($user['role'] === 'admin') {
            echo json_encode(['status' => 'success', 'redirect' => 'admin-dashboard.html']);
        } elseif ($user['role'] === 'staff') {
            echo json_encode(['status' => 'success', 'redirect' => 'staff-dashboard.html']);
        }
        http_response_code(200);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
        http_response_code(401);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>
