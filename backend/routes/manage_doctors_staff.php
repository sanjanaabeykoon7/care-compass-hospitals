<?php
require_once '../config/db.php';

header('Content-Type: application/json');
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        // Fetch all doctors and staff
        $query = "SELECT * FROM doctors_staff";
        $result = $conn->query($query);
        $doctorsStaff = [];
        while ($row = $result->fetch_assoc()) {
            $doctorsStaff[] = $row;
        }
        echo json_encode($doctorsStaff);
        break;

    case 'POST':
        // Add a new doctor/staff
        $data = json_decode(file_get_contents("php://input"), true);
        $name = $data['name'];
        $specialty = $data['specialty'];
        $qualifications = $data['qualifications'];
        $contact = $data['contact'];
        $available_days = $data['available_days'];
        $available_hours = $data['available_hours'];

        $query = "INSERT INTO doctors_staff (name, specialty, qualifications, contact, available_days, available_hours) 
                  VALUES ('$name', '$specialty', '$qualifications', '$contact', '$available_days', '$available_hours')";
        $conn->query($query);

        echo json_encode(['message' => 'Doctor/Staff added successfully']);
        break;

    case 'PUT':
        // Update an existing doctor/staff
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];
        $name = $data['name'];
        $specialty = $data['specialty'];
        $qualifications = $data['qualifications'];
        $contact = $data['contact'];
        $available_days = $data['available_days'];
        $available_hours = $data['available_hours'];

        $query = "UPDATE doctors_staff 
                  SET name='$name', specialty='$specialty', qualifications='$qualifications', 
                      contact='$contact', available_days='$available_days', available_hours='$available_hours'
                  WHERE id=$id";
        $conn->query($query);

        echo json_encode(['message' => 'Doctor/Staff updated successfully']);
        break;

    case 'DELETE':
        // Delete a doctor/staff
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $query = "DELETE FROM doctors_staff WHERE id=$id";
        $conn->query($query);

        echo json_encode(['message' => 'Doctor/Staff deleted successfully']);
        break;

    default:
        echo json_encode(['message' => 'Invalid request']);
        break;
}
?>
