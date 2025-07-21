<?php
session_start();

// Destroy the session
session_unset();
session_destroy();

// Send a JSON response
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
exit;
?>
