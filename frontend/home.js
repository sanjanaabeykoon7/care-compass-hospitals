document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links within the same page
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetHref = link.getAttribute('href');

            if (targetHref === 'home.html' || targetHref === '#') {
                // Scroll to the top for "Home" link
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            } else if (targetHref.includes('#')) {
                const targetId = targetHref.split('#')[1]; // Extract section ID
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    event.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 30, // Adjust for header height
                        behavior: 'smooth',
                    });
                }
            }
        });
    });

    // Handle scrolling when home.html loads with a hash (#about or #services)
    if (location.hash) {
        const targetId = location.hash.slice(1); // Remove '#' to get section ID
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Scroll to the section after the page has fully loaded
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 30, // Adjust for header height
                    behavior: 'smooth',
                });
            }, 300); // Small delay ensures layout is ready
        }
    }
    
    // Dynamically highlight the active link based on scroll position
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - 50) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(currentSection)) {
                link.classList.add("active");
            }
        });
    });

    // Add dynamic date in footer
    const footer = document.querySelector('footer .footer-bottom p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = `© Care Compass Hospitals ${year} All rights reserved.`;
    }
});

// Admin/Staff Login Validation
document.querySelector("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("[name='email']").value;
    const password = document.querySelector("[name='password']").value;

    try {
        const response = await fetch("http://localhost/care_compass_hospitals/backend/routes/loginAdmin.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();

        if (result.status === "success") {
            window.location.href = result.redirect;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
});
