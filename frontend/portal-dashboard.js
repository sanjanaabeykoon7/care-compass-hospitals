document.addEventListener("DOMContentLoaded", () => {
    const appointmentsSection = document.getElementById("appointments-section");
    const medicalRecordsSection = document.getElementById("medical-records-section");
    const labResultsSection = document.getElementById("lab-results-section");
    const logoutButton = document.querySelector("#logout");

    const viewAppointmentsLink = document.getElementById("view-appointments");
    const viewMedicalRecordsLink = document.getElementById("view-medical-records");
    const viewLabResultsLink = document.getElementById("view-lab-results");
    const scheduleAppointmentButton = document.getElementById("schedule-appointment");

    const appointmentsList = document.getElementById("appointments-list");
    const medicalRecordsList = document.getElementById("medical-records-list");
    const labResultsList = document.getElementById("lab-results-list");

    let userId = null;

    // Fetch user ID from session
    async function fetchUserId() {
        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/get_user_id.php");
            const result = await response.json();

            if (result.success) {
                userId = result.user_id;
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    }

    // Initialize and fetch user ID
    fetchUserId();

    // Show Appointments Section
    viewAppointmentsLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (!userId) {
            alert("Unable to load appointments. Please try again later.");
            return;
        }
        showSection(appointmentsSection);
        loadAppointments(userId);
    });

    // Show Medical Records Section
    viewMedicalRecordsLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (!userId) {
            alert("Unable to load medical records. Please try again later.");
            return;
        }
        showSection(medicalRecordsSection);
        loadMedicalRecords(userId);
    });

    // Show Lab Results Section
    viewLabResultsLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (!userId) {
            alert("Unable to load lab results. Please try again later.");
            return;
        }
        showSection(labResultsSection);
        loadLabResults(userId);
    });

    // Utility function to show a section
    function showSection(section) {
        appointmentsSection.classList.add("hidden");
        medicalRecordsSection.classList.add("hidden");
        labResultsSection.classList.add("hidden");
        section.classList.remove("hidden");
    }

    
    // Load Appointments
    async function loadAppointments(userId) {
        appointmentsList.innerHTML = "<p>Loading appointments...</p>";
        try {
            const response = await fetch(`http://localhost/care_compass_hospitals/backend/routes/get_appointments.php?patient_id=${userId}`);
            const result = await response.json();

            if (result.success) {
                if (result.appointments.length > 0) {
                    const appointments = result.appointments.map(
                        (appointment) => `
                        <li>
                            ${appointment.date} - ${appointment.time} with Dr. ${appointment.doctor}
                            <button onclick="cancelAppointment(${appointment.id})">Cancel</button>
                        </li>
                    `
                    );
                    appointmentsList.innerHTML = `<ul>${appointments.join("")}</ul>`;
                } else {
                    appointmentsList.innerHTML = "<p>No appointments scheduled yet.</p>";
                }
            } else {
                appointmentsList.innerHTML = `<p>${result.message}</p>`;
            }
        } catch (error) {
            console.error("Error loading appointments:", error);
            appointmentsList.innerHTML = "<p>An error occurred while loading appointments.</p>";
        }
    }

    // Schedule Appointment Button Click
    scheduleAppointmentButton.addEventListener("click", () => {
        if (!userId) {
            alert("Unable to schedule appointments. Please log in again.");
            return;
        }

        const doctor = prompt("Enter the doctor's name:");
        const date = prompt("Enter the appointment date (YYYY-MM-DD):");
        const time = prompt("Enter the appointment time (HH:MM):");

        // Validate inputs
        if (!doctor || !date || !time) {
            alert("All fields are required to schedule an appointment.");
            return;
        }

        // Validate date and time formats
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD
        const timeRegex = /^\d{2}:\d{2}$/; // Matches HH:MM

        if (!dateRegex.test(date)) {
            alert("Invalid date format. Please use YYYY-MM-DD.");
            return;
        }

        if (!timeRegex.test(time)) {
            alert("Invalid time format. Please use HH:MM.");
            return;
        }

        // If all inputs are valid, schedule the appointment
        scheduleAppointment({ user_id: userId, doctor, date, time });
    });


    // Schedule an appointment
    async function scheduleAppointment(appointmentData) {
        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/schedule_appointment.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentData),
            });

            const result = await response.json();
            if (result.success) {
                alert("Appointment scheduled successfully!");
                loadAppointments(userId); // Refresh appointments
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error scheduling appointment:", error);
            alert("An error occurred while scheduling the appointment.");
        }
    }

    // Cancel an appointment
    window.cancelAppointment = async function (appointmentId) {
        const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
        if (!confirmCancel) return;

        try {
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/cancel_appointment.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: appointmentId }),
            });

            const result = await response.json();
            if (result.success) {
                alert("Appointment cancelled successfully!");
                loadAppointments(userId); // Refresh appointments
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            alert("An error occurred while cancelling the appointment.");
        }
    };

    // Load Medical Records
    async function loadMedicalRecords(userId) {
        medicalRecordsList.innerHTML = "<p>Loading medical records...</p>";
        try {
            const response = await fetch(`http://localhost/care_compass_hospitals/backend/routes/get_medical_records.php?patient_id=${userId}`);
            const result = await response.json();

            if (result.success) {
                if (result.medical_records.length > 0) {
                    const medical_records = result.medical_records.map(
                        (medical_record) => `
                        <li>
                            ${medical_record.notes} - ${medical_record.prescriptions}
                        </li>
                    `
                    );
                    medicalRecordsList.innerHTML = `<ul>${medical_records.join("")}</ul>`;
                } else {
                    medicalRecordsList.innerHTML = "<p>No medical records found yet.</p>";
                }
            } else {
                medicalRecordsList.innerHTML = `<p>${result.message}</p>`;
            }
        } catch (error) {
            console.error("Error loading medical records:", error);
            medicalRecordsList.innerHTML = "<p>An error occurred while loading medical records.</p>";
        }
    }

    // Load Lab Results
    async function loadLabResults(userId) {
        labResultsList.innerHTML = "<p>Loading lab results...</p>";
        try {
            const response = await fetch(`http://localhost/care_compass_hospitals/backend/routes/get_lab_results.php?patient_id=${userId}`);
            const result = await response.json();

            if (result.success) {
                if (result.lab_results.length > 0) {
                    const lab_results = result.lab_results.map(
                        (lab_result) => `
                        <li>
                            ${lab_result.test_date} - ${lab_result.test_name} - ${lab_result.result}
                        </li>
                    `
                    );
                    labResultsList.innerHTML = `<ul>${lab_results.join("")}</ul>`;
                } else {
                    labResultsList.innerHTML = "<p>No lab results found yet.</p>";
                }
            } else {
                labResultsList.innerHTML = `<p>${result.message}</p>`;
            }
        } catch (error) {
            console.error("Error loading lab results:", error);
            labResultsList.innerHTML = "<p>An error occurred while loading lab results.</p>";
        }
    }

    // Logout
    logoutButton.addEventListener("click", () => {
        fetch('../backend/routes/logout.php', {
            method: 'POST', // Use POST to ensure the session is properly destroyed
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message); // Notify the user
                    window.location.href = "patient-portal.html"; // Redirect to login page
                } else {
                    alert("Failed to logout. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                alert("An error occurred while logging out.");
            });
    });

    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});
