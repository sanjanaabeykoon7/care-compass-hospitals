<?php
require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $conn->real_escape_string($_POST["name"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $contact = $conn->real_escape_string($_POST["contact"]);
    $department = $conn->real_escape_string($_POST["department"]);
    $message = $conn->real_escape_string($_POST["message"]);

    $sql = "INSERT INTO feedback_queries (name, email, contact_number, department, message)
            VALUES ('$name', '$email', '$contact', '$department', '$message')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Feedback submitted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to submit feedback!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method!"]);
}
?>
