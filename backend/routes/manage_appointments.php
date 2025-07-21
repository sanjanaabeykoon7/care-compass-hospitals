<?php
require_once '../config/db.php';
header('Content-Type: application/json');

// Determine the request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all appointments
        fetchAppointments($conn);
        break;

    case 'POST':
        // Reschedule or cancel an appointment
        handleAppointmentAction($conn);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        break;
}

function fetchAppointments($conn) {
    $query = "SELECT a.id, a.doctor, a.date, a.time, u.full_name AS patient 
              FROM appointments a 
              JOIN users u ON a.patient_id = u.id";
    
    $result = mysqli_query($conn, $query);

    if ($result) {
        $appointments = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $appointments[] = $row;
        }
        echo json_encode(['success' => true, 'appointments' => $appointments]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch appointments']);
    }
}

function handleAppointmentAction($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['action']) || !isset($data['appointment_id'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        return;
    }

    $action = $data['action'];
    $appointment_id = $data['appointment_id'];

    if ($action === 'reschedule') {
        if (!isset($data['date']) || !isset($data['time'])) {
            echo json_encode(['success' => false, 'message' => 'Date and time are required for rescheduling']);
            return;
        }

        $date = $data['date'];
        $time = $data['time'];

        $query = "UPDATE appointments SET date = ?, time = ? WHERE id = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "ssi", $date, $time, $appointment_id);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Appointment rescheduled successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to reschedule appointment']);
        }

        mysqli_stmt_close($stmt);

    } elseif ($action === 'cancel') {
        $query = "DELETE FROM appointments WHERE id = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $appointment_id);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Appointment canceled successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to cancel appointment']);
        }

        mysqli_stmt_close($stmt);

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
}

mysqli_close($conn);
?>
