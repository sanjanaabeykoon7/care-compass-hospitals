document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});

// Feedback Form Submission
document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
        const response = await fetch("../backend/routes/store_feedback.php", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (result.status === "success") {
            alert(result.message);
            event.target.reset();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please try again later.");
    }
});
