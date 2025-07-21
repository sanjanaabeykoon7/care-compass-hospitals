document.addEventListener("DOMContentLoaded", () => {
    fetchDoctorsStaff();
    
    // Search functionality for filtering staff by specialty
    const searchBar = document.querySelector("#search-bar");
    searchBar.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        filterDoctorsStaff(searchTerm);
    });

    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});

// Fetch and Display Data
function fetchDoctorsStaff() {
    fetch("http://localhost/care_compass_hospitals/backend/routes/manage_doctors_staff.php")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        })
        .then((data) => {
            populateDoctorsStaff(data);
        })
        .catch((error) => console.error("Error fetching doctors and staff:", error));
}

function populateDoctorsStaff(data) {
    const container = document.querySelector("#doctors-staff-container");
    container.innerHTML = ""; // Clear existing content

    data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("doctor-card");
        card.dataset.specialty = item.specialty.toLowerCase(); // Add specialty data attribute

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>Specialty:</strong> ${item.specialty}</p>
            <p><strong>Qualifications:</strong> ${item.qualifications}</p>
            <p><strong>Contact:</strong> ${item.contact}</p>
            <p><strong>Availability:</strong> ${item.available_days}</p>
            <p>${item.available_hours}</p>
        `;

        container.appendChild(card);
    });
}

// Filter Function
function filterDoctorsStaff(searchTerm) {
    const cards = document.querySelectorAll(".doctor-card");
    cards.forEach((card) => {
        const specialty = card.dataset.specialty;
        if (specialty.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
