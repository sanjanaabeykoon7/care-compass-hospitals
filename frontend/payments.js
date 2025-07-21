document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});

// Payment Form Submission
document.getElementById("payNowButton").addEventListener("click", async function (event) {
    event.preventDefault();

    const paymentInfoForm = document.getElementById("paymentInfoForm");
    const formData = new FormData(paymentInfoForm);
    const payerInfoForm = document.getElementById("payerInfoForm");

    // Check if all fields are filled
    if (!paymentInfoForm.checkValidity(), !payerInfoForm.checkValidity()) {
        alert("Please fill in all fields.");
        return;
    }

    const paymentTypeSelected = document.querySelector('input[name="payment-type"]:checked');
    if (!paymentTypeSelected) {
        alert("Please select a payment type.");
        return;
    }

    try {
        const response = await fetch("../backend/routes/store_payment.php", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (result.status === "success") {
            alert(result.message);
            paymentInfoForm.reset();
            payerInfoForm.reset();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error saving payment:", error);
        alert("An error occurred. Please try again later.");
    }
});
