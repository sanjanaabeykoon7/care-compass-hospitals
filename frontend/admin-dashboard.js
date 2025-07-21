document.addEventListener("DOMContentLoaded", function () {
    // Initialize dashboard by fetching data for all sections
    fetchUsers();
    fetchAppointments();
    fetchMedicalRecords();
  
    /**
     * Fetch Users and Populate User Management Section
     */
    const userTableBody = document.querySelector("#userTable tbody");
    const addUserButton = document.getElementById("addUserButton");

    // Fetch and populate admin/staff data
    function fetchUsers() {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_users.php", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    populateUserTable(data.data);
                } else {
                    alert("Failed to fetch user data");
                }
            })
            .catch((error) => console.error("Error fetching users:", error));
    }

    // Populate the user table dynamically
    function populateUserTable(users) {
        userTableBody.innerHTML = ""; // Clear existing rows
        users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="editButton" data-id="${user.id}">Edit</button>
                    <button class="deleteButton" data-id="${user.id}">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        // Attach event listeners to edit and delete buttons
        attachEditButtons();
        attachDeleteButtons();
    }

    // Add a new user
    function addUser(user) {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    fetchUsers(); // Refresh the table
                    alert("User added successfully!");
                } else {
                    alert("Failed to add user: " + data.message);
                }
            })
            .catch((error) => console.error("Error adding user:", error));
    }

    // Edit an existing user
    function editUser(user) {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_users.php", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    fetchUsers(); // Refresh the table
                    alert("User updated successfully!");
                } else {
                    alert("Failed to update user: " + data.message);
                }
            })
            .catch((error) => console.error("Error editing user:", error));
    }

    // Delete a user
    function deleteUser(userId) {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_users.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    fetchUsers(); // Refresh the table
                    alert("User deleted successfully!");
                } else {
                    alert("Failed to delete user: " + data.message);
                }
            })
            .catch((error) => console.error("Error deleting user:", error));
    }

    // Attach event listeners to Edit buttons
    function attachEditButtons() {
        document.querySelectorAll(".editButton").forEach((button) => {
            button.addEventListener("click", () => {
                const userId = button.getAttribute("data-id");
                const userRow = button.closest("tr");
                const fullName = userRow.children[1].textContent;
                const email = userRow.children[2].textContent;
                const role = userRow.children[3].textContent;

                const updatedUser = promptEditUser(userId, fullName, email, role);
                if (updatedUser) editUser(updatedUser);
            });
        });
    }

    // Attach event listeners to Delete buttons
    function attachDeleteButtons() {
        document.querySelectorAll(".deleteButton").forEach((button) => {
            button.addEventListener("click", () => {
                const userId = button.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this user?")) {
                    deleteUser(userId);
                }
            });
        });
    }

    // Prompt user input for adding or editing
    function promptEditUser(id, fullName = "", email = "", role = "") {
        const updatedName = prompt("Enter full name:", fullName);
        if (!updatedName) return null;

        const updatedEmail = prompt("Enter email:", email);
        if (!updatedEmail) return null;

        const updatedRole = prompt("Enter role (admin/staff):", role);
        if (!updatedRole || !["admin", "staff"].includes(updatedRole.toLowerCase())) {
            alert("Invalid role. Please enter either 'admin' or 'staff'.");
            return null;
        }

        return {
            id: id,
            full_name: updatedName,
            email: updatedEmail,
            role: updatedRole.toLowerCase(),
        };
    }

    // Add User Button Click Event
    addUserButton.addEventListener("click", () => {
        const newUser = promptEditUser(null);
        if (newUser) {
            const password = prompt("Enter password for the new user:");
            if (!password) return;

            newUser.password = password;
            addUser(newUser);
        }
    });
  
    /**
     * Fetch Appointments and Populate Appointment Management Section
     */
    // Fetch and display all appointments
    function fetchAppointments() {
        fetch('../backend/routes/manage_appointments.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const appointmentsTable = document.getElementById('appointments-table-body');
                    appointmentsTable.innerHTML = ''; // Clear existing rows

                    data.appointments.forEach(appointment => {
                        const row = document.createElement('tr');

                        row.innerHTML = `
                            <td>${appointment.id}</td>
                            <td>${appointment.patient}</td>
                            <td>${appointment.doctor}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td>
                                <button class="reschedule-btn" data-id="${appointment.id}">Reschedule</button>
                                <button class="cancel-btn" data-id="${appointment.id}">Cancel</button>
                            </td>
                        `;
                        appointmentsTable.appendChild(row);
                    });

                    // Attach event listeners to buttons
                    attachEventListeners();
                } else {
                    alert('Failed to fetch appointments');
                }
            })
            .catch(error => console.error('Error fetching appointments:', error));
    }

    // Reschedule an appointment
    function rescheduleAppointment(appointmentId, newDate, newTime) {
        fetch('../backend/routes/manage_appointments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'reschedule',
                appointment_id: appointmentId,
                date: newDate,
                time: newTime,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    fetchAppointments(); // Refresh the appointments list
                } else {
                    alert(data.message || 'Failed to reschedule appointment');
                }
            })
            .catch(error => console.error('Error rescheduling appointment:', error));
    }

    // Cancel an appointment
    function cancelAppointment(appointmentId) {
        fetch('../backend/routes/manage_appointments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'cancel',
                appointment_id: appointmentId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    fetchAppointments(); // Refresh the appointments list
                } else {
                    alert(data.message || 'Failed to cancel appointment');
                }
            })
            .catch(error => console.error('Error canceling appointment:', error));
    }

    // Attach event listeners to Reschedule and Cancel buttons
    function attachEventListeners() {
        // Reschedule buttons
        document.querySelectorAll('.reschedule-btn').forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.getAttribute('data-id');

                // Prompt for new date and time
                const newDate = prompt('Enter new date (YYYY-MM-DD):');
                const newTime = prompt('Enter new time (HH:MM):');

                if (newDate && newTime) {
                    rescheduleAppointment(appointmentId, newDate, newTime);
                } else {
                    alert('Both date and time are required to reschedule an appointment');
                }
            });
        });

        // Cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.getAttribute('data-id');

                if (confirm('Are you sure you want to cancel this appointment?')) {
                    cancelAppointment(appointmentId);
                }
            });
        });
    }

    /**
     * Fetch Medical Records and Populate Medical Records Section
     */
    const recordTableBody = document.querySelector("#recordTable tbody");
    const addRecordButton = document.querySelector("#addRecordButton");

    // Fetch and display medical records
    async function fetchMedicalRecords() {
        try {
        const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_medical_records.php");
        const data = await response.json();

        if (data.status === "success") {
            populateMedicalRecords(data.data);
        } else {
            console.error("Error fetching medical records:", data.message);
        }
        } catch (error) {
        console.error("Error fetching medical records:", error);
        }
    }

    // Populate medical records table
    function populateMedicalRecords(records) {
        recordTableBody.innerHTML = ""; // Clear existing rows
        records.forEach((record) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.patient}</td>
            <td>${record.notes}</td>
            <td>${record.prescriptions}</td>
            <td>
            <button class="edit-btn" data-id="${record.id}">Edit</button>
            <button class="delete-btn" data-id="${record.id}">Delete</button>
            </td>
        `;

        recordTableBody.appendChild(row);
        });

        addEventListenersToButtons();
    }

    // Add event listeners to buttons
    function addEventListenersToButtons() {
        const editButtons = document.querySelectorAll(".edit-btn");
        const deleteButtons = document.querySelectorAll(".delete-btn");

        editButtons.forEach((button) =>
        button.addEventListener("click", () => {
            const recordId = button.getAttribute("data-id");
            handleEditRecord(recordId);
        })
        );

        deleteButtons.forEach((button) =>
        button.addEventListener("click", () => {
            const recordId = button.getAttribute("data-id");
            handleDeleteRecord(recordId);
        })
        );
    }

    // Handle adding a new record
    addRecordButton.addEventListener("click", () => {
        const patientId = prompt("Enter Patient ID:");
        const notes = prompt("Enter Notes:");
        const prescriptions = prompt("Enter Prescriptions:");

        if (patientId && notes && prescriptions) {
        addMedicalRecord(patientId, notes, prescriptions);
        } else {
        alert("All fields are required.");
        }
    });

    async function addMedicalRecord(patientId, notes, prescriptions) {
        try {
        const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_medical_records.php", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            patient_id: patientId,
            notes: notes,
            prescriptions: prescriptions,
            }),
        });

        const data = await response.json();

        if (data.status === "success") {
            alert(data.message);
            fetchMedicalRecords(); // Refresh the table
        } else {
            alert("Error adding record: " + data.message);
        }
        } catch (error) {
        console.error("Error adding record:", error);
        }
    }

    // Handle editing an existing record
    function handleEditRecord(recordId) {
        const notes = prompt("Enter Updated Notes:");
        const prescriptions = prompt("Enter Updated Prescriptions:");

        if (notes && prescriptions) {
        editMedicalRecord(recordId, notes, prescriptions);
        } else {
        alert("Both fields are required.");
        }
    }

    async function editMedicalRecord(recordId, notes, prescriptions) {
        try {
        const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_medical_records.php", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            id: recordId,
            notes: notes,
            prescriptions: prescriptions,
            }),
        });

        const data = await response.json();

        if (data.status === "success") {
            alert(data.message);
            fetchMedicalRecords(); // Refresh the table
        } else {
            alert("Error editing record: " + data.message);
        }
        } catch (error) {
        console.error("Error editing record:", error);
        }
    }

    // Handle deleting a record
    function handleDeleteRecord(recordId) {
        if (confirm("Are you sure you want to delete this record?")) {
        deleteMedicalRecord(recordId);
        }
    }

    async function deleteMedicalRecord(recordId) {
        try {
        const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_medical_records.php", {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: recordId }),
        });

        const data = await response.json();

        if (data.status === "success") {
            alert(data.message);
            fetchMedicalRecords(); // Refresh the table
        } else {
            alert("Error deleting record: " + data.message);
        }
        } catch (error) {
        console.error("Error deleting record:", error);
        }
    }
  
    /**
     * Fetch and Populate Lab Results Section
     */
    const labResultTableBody = document.querySelector("#labResultTable tbody");
    const uploadReportButton = document.getElementById("uploadReportButton");

    // Fetch and display all lab results
    const fetchLabResults = async () => {
        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_lab_results.php");
            const data = await response.json();

            if (data.status === "success") {
                labResultTableBody.innerHTML = ""; // Clear existing rows
                data.data.forEach((record) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${record.id}</td>
                        <td>${record.patient}</td>
                        <td>${record.test_name}</td>
                        <td>${record.test_date}</td>
                        <td>${record.result}</td>
                        <td>
                            <button class="editButton" data-id="${record.id}">Edit</button>
                            <button class="deleteButton" data-id="${record.id}">Delete</button>
                        </td>
                    `;
                    labResultTableBody.appendChild(row);
                });
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching lab results:", error);
        }
    };

    // Handle adding a new lab result
    const addLabResult = async (patientId, testName, testDate, result) => {
        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_lab_results.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patient_id: patientId,
                    test_name: testName,
                    test_date: testDate,
                    result: result,
                }),
            });
            const data = await response.json();
            if (data.status === "success") {
                fetchLabResults();
                alert("Lab result added successfully!");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding lab result:", error);
        }
    };

    // Handle editing a lab result
    const editLabResult = async (id, testName, testDate, result) => {
        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_lab_results.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    test_name: testName,
                    test_date: testDate,
                    result: result,
                }),
            });
            const data = await response.json();
            if (data.status === "success") {
                fetchLabResults();
                alert("Lab result updated successfully!");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error editing lab result:", error);
        }
    };

    // Handle deleting a lab result
    const deleteLabResult = async (id) => {
        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/manage_lab_results.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id }),
            });
            const data = await response.json();
            if (data.status === "success") {
                fetchLabResults();
                alert("Lab result deleted successfully!");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting lab result:", error);
        }
    };

    // Add event listener for the "Upload Report" button
    uploadReportButton.addEventListener("click", () => {
        const patientId = prompt("Enter Patient ID:");
        const testName = prompt("Enter Test Name:");
        const testDate = prompt("Enter Test Date (YYYY-MM-DD):");
        const result = prompt("Enter Result:");
        if (patientId && testName && testDate && result) {
            addLabResult(patientId, testName, testDate, result);
        } else {
            alert("All fields are required!");
        }
    });

    // Add event listeners for edit and delete buttons
    labResultTableBody.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("editButton")) {
            const id = target.getAttribute("data-id");
            const testName = prompt("Enter new Test Name:");
            const testDate = prompt("Enter new Test Date (YYYY-MM-DD):");
            const result = prompt("Enter new Result:");
            if (testName && testDate && result) {
                editLabResult(id, testName, testDate, result);
            } else {
                alert("All fields are required!");
            }
        } else if (target.classList.contains("deleteButton")) {
            const id = target.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this lab result?")) {
                deleteLabResult(id);
            }
        }
    });
    // Initial fetch of lab results
    fetchLabResults();

    /**
     * Fetch and Populate Doctors and Staff Section
     */
    const doctorsStaffTable = document.getElementById("doctorsStaffTable").querySelector("tbody");

    // Fetch Doctors and Staff
    function fetchDoctorsStaff() {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_doctors_staff.php")
            .then((response) => response.json())
            .then((data) => {
                doctorsStaffTable.innerHTML = "";
                data.forEach((doctor) => {
                    const row = `<tr>
                        <td>${doctor.id}</td>
                        <td>${doctor.name}</td>
                        <td>${doctor.specialty}</td>
                        <td>${doctor.qualifications}</td>
                        <td>${doctor.contact}</td>
                        <td>${doctor.available_days}</td>
                        <td>${doctor.available_hours}</td>
                        <td>
                            <button onclick="editDoctorStaff(${doctor.id})">Edit</button>
                            <button onclick="deleteDoctorStaff(${doctor.id})">Delete</button>
                        </td>
                    </tr>`;
                    doctorsStaffTable.innerHTML += row;
                });
            })
            .catch((error) => console.error('Error fetching doctors and staff:', error));
    }

    // Add Doctor/Staff
    document.getElementById("addDoctorStaffButton").addEventListener("click", () => {
        const name = prompt("Enter name:");
        const specialty = prompt("Enter specialty:");
        const qualifications = prompt("Enter qualifications:");
        const contact = prompt("Enter contact:");
        const available_days = prompt("Enter available days:");
        const available_hours = prompt("Enter available hours:");

        if (name && specialty && qualifications && contact && available_days && available_hours) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_doctors_staff.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, specialty, qualifications, contact, available_days, available_hours }),
            })
            .then(() => fetchDoctorsStaff())
            .catch((error) => console.error('Error adding doctor/staff:', error));
        } else {
            alert("All fields are required.");
        }
    });

    // Edit Doctor/Staff
    window.editDoctorStaff = function(id) {
        const name = prompt("Enter new name:");
        const specialty = prompt("Enter new specialty:");
        const qualifications = prompt("Enter new qualifications:");
        const contact = prompt("Enter new contact:");
        const available_days = prompt("Enter new available days:");
        const available_hours = prompt("Enter new available hours:");

        if (name && specialty && qualifications && contact && available_days && available_hours) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_doctors_staff.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name, specialty, qualifications, contact, available_days, available_hours }),
            })
            .then(() => fetchDoctorsStaff())
            .catch((error) => console.error('Error editing doctor/staff:', error));
        } else {
            alert("All fields are required.");
        }
    }

    // Delete Doctor/Staff
    window.deleteDoctorStaff = function(id) {
        if (confirm("Are you sure you want to delete this entry?")) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_doctors_staff.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            .then(() => fetchDoctorsStaff())
            .catch((error) => console.error('Error deleting doctor/staff:', error));
        }
    }

    // Initial fetch
    fetchDoctorsStaff();

    /**
     * Fetch and Populate Feedback Section
     */
    const feedbacksTable = document.getElementById("feedbacksTable").querySelector("tbody");

    // Fetch Feedback
    function fetchFeedback() {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_feedback.php")
            .then((response) => response.json())
            .then((data) => {
                feedbacksTable.innerHTML = "";
                data.forEach((feedback) => {
                    const row = `<tr>
                        <td>${feedback.id}</td>
                        <td>${feedback.name}</td>
                        <td>${feedback.email}</td>
                        <td>${feedback.contact_number}</td>
                        <td>${feedback.department}</td>
                        <td>${feedback.message}</td>
                        <td>${feedback.submitted_at}</td>
                        <td>
                            <button onclick="deleteFeedback(${feedback.id})">Delete</button>
                        </td>
                    </tr>`;
                    feedbacksTable.innerHTML += row;
                });
            })
            .catch((error) => console.error('Error fetching feedbacks:', error));
    }

    // Delete Feedback
    window.deleteFeedback = function(id) {
        if (confirm("Do you want to delete this feedback/query?")) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_feedback.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            .then(() => fetchFeedback())
            .catch((error) => console.error('Error deleting feedback/query:', error));
        }
    }

    // Initial fetch
    fetchFeedback();

    /**
     * Fetch and Populate Payments Section
     */
    const paymentsTable = document.getElementById("paymentsTable").querySelector("tbody");

    // Fetch Payments
    function fetchPayment() {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_payment.php")
            .then((response) => response.json())
            .then((data) => {
                paymentsTable.innerHTML = "";
                data.forEach((payment) => {
                    const row = `<tr>
                        <td>${payment.id}</td>
                        <td>${payment.hospital}</td>
                        <td>${payment.payment_category}</td>
                        <td>${payment.invoice_no}</td>
                        <td>${payment.patient_name}</td>
                        <td>${payment.amount}</td>
                        <td>${payment.payed_at}</td>
                        <td>
                            <button onclick="deletePayment(${payment.id})">Delete</button>
                        </td>
                    </tr>`;
                    paymentsTable.innerHTML += row;
                });
            })
            .catch((error) => console.error('Error fetching payments:', error));
    }

    // Delete Payment
    window.deletePayment = function(id) {
        if (confirm("Do you want to delete this payment?")) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_payment.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            .then(() => fetchPayment())
            .catch((error) => console.error('Error deleting payment:', error));
        }
    }

    // Initial fetch
    fetchPayment();

    /**
     * Fetch and Populate Patient Section
     */
    const patientTable = document.getElementById("patientTable").querySelector("tbody");

    // Fetch Patients
    function fetchPatient() {
        fetch("http://localhost/care_compass_hospitals/backend/routes/manage_patients.php")
            .then((response) => response.json())
            .then((data) => {
                patientTable.innerHTML = "";
                data.forEach((patient) => {
                    const row = `<tr>
                        <td>${patient.id}</td>
                        <td>${patient.full_name}</td>
                        <td>${patient.email}</td>
                        <td>
                            <button onclick="editPatient(${patient.id})">Edit</button>
                            <button onclick="deletePatient(${patient.id})">Delete</button>
                        </td>
                    </tr>`;
                    patientTable.innerHTML += row;
                });
            })
            .catch((error) => console.error('Error fetching patients:', error));
    }

    // Edit Patient
    window.editPatient = function(id) {
        const full_name = prompt("Enter full name:");
        const email = prompt("Enter new email:");
        
        if (full_name && email) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_patients.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, full_name, email }),
            })
            .then(() => fetchPatient())
            .catch((error) => console.error('Error editing patient:', error));
        } else {
            alert("All fields are required.");
        }
    }

    // Delete Patient
    window.deletePatient = function(id) {
        if (confirm("Are you sure you want to delete this patient?")) {
            fetch("http://localhost/care_compass_hospitals/backend/routes/manage_patients.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            .then(() => fetchPatient())
            .catch((error) => console.error('Error deleting patient:', error));
        }
    }

    // Initial fetch
    fetchPatient();

    // Logout
    document.getElementById("logoutButton").addEventListener("click", () => {
        fetch('../backend/routes/logout.php', {
            method: 'POST', // Use POST to ensure the session is properly destroyed
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message); // Notify the user
                    window.location.href = "home.html"; // Redirect to login page
                } else {
                    alert("Failed to logout. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                alert("An error occurred while logging out.");
            });
    });
});
  