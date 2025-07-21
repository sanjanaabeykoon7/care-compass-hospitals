document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    const messageDiv = document.getElementById("message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Send a POST request to backend
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // Parse the response JSON
            const result = await response.json();

            // Handle response based on HTTP status
            if (response.ok) { // If status code is 200
                messageDiv.style.display = "block";
                messageDiv.style.color = "green";
                messageDiv.textContent = result.message;

                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = "patient-portal.html";
                }, 2000);
            } else { // For 400 and other non-200 status codes
                messageDiv.style.display = "block";
                messageDiv.style.color = "red";
                messageDiv.textContent = result.message || "An error occurred. Please try again.";
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error("Error during signup:", error);
            messageDiv.style.display = "block";
            messageDiv.style.color = "red";
            messageDiv.textContent = "A network error occurred. Please try again later.";
        }
    });

    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});
