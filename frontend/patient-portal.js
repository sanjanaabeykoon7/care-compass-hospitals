document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(loginForm);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            // Send data to backend
            const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
                
                // Redirect to the patient dashboard
                alert(result.message);
                window.location.href = "portal-dashboard.html";
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        }
    });

    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});
