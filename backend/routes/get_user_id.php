<?php
session_start(); // Ensure session is started
header('Content-Type: application/json');

// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'user_id' => $_SESSION['user_id'],
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'User is not logged in.',
    ]);
    http_response_code(401); // Unauthorized
}
?>
