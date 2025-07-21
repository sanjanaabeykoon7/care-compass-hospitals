<?php
require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $hospital = $conn->real_escape_string($_POST["hospital"]);
    $payment_category = $conn->real_escape_string($_POST["payment-category"]);
    $invoice_no = $conn->real_escape_string($_POST["invoice-no"]);
    $patient_name = $conn->real_escape_string($_POST["patient-name"]);
    $amount = $conn->real_escape_string($_POST["amount"]);

    $sql = "INSERT INTO payments (hospital, payment_category, invoice_no, patient_name, amount)
            VALUES ('$hospital', '$payment_category', '$invoice_no', '$patient_name', '$amount')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Payment successfull!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Payment unsuccessfull!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method!"]);
}
?>
