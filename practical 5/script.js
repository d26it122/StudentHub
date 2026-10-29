/* =====================================================
   STUDENTHUB JAVASCRIPT
   ===================================================== */


/* =====================================================
   CURRENT YEAR
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});


/* =====================================================
   MOBILE MENU
   ===================================================== */

function toggleMenu() {

    const navLinks =
        document.getElementById("navLinks");

    if (navLinks) {

        navLinks.classList.toggle("active");

    }

}


/* =====================================================
   DARK / LIGHT MODE
   ===================================================== */

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const button =
        document.getElementById("themeButton");

    if (
        document.body.classList.contains("dark-mode")
    ) {

        if (button) {
            button.innerHTML = "☀️ Light Mode";
        }

        localStorage.setItem("theme", "dark");

    }

    else {

        if (button) {
            button.innerHTML = "🌙 Dark Mode";
        }

        localStorage.setItem("theme", "light");

    }

}


/* =====================================================
   LOAD SAVED THEME
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const savedTheme =
        localStorage.getItem("theme");

    const button =
        document.getElementById("themeButton");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        if (button) {
            button.innerHTML = "☀️ Light Mode";
        }

    }

    else {

        if (button) {
            button.innerHTML = "🌙 Dark Mode";
        }

    }

});


/* =====================================================
   NOTIFICATION
   ===================================================== */

function closeNotification() {

    const notification =
        document.getElementById("notification");

    if (notification) {

        notification.style.display = "none";

    }

}


/* =====================================================
   MODAL
   ===================================================== */

function openModal() {

    const modal =
        document.getElementById("myModal");

    if (modal) {

        modal.style.display = "flex";

    }

}


function closeModal() {

    const modal =
        document.getElementById("myModal");

    if (modal) {

        modal.style.display = "none";

    }

}


/* =====================================================
   CLOSE MODAL BY CLICKING OUTSIDE
   ===================================================== */

window.addEventListener("click", function (event) {

    const modal =
        document.getElementById("myModal");

    if (
        modal &&
        event.target === modal
    ) {

        modal.style.display = "none";

    }

});


/* =====================================================
   CLOSE MODAL WITH ESCAPE
   ===================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeModal();

    }

});


/* =====================================================
   IMAGE / CONTENT SLIDER
   ===================================================== */

let currentSlide = 0;


/*
   Display selected slide
*/

function showSlide(index) {

    const slides =
        document.querySelectorAll(".slide");


    /*
       If page has no slider,
       simply stop.
    */

    if (slides.length === 0) {

        return;

    }


    /*
       Go to first slide
       after the last slide.
    */

    if (index >= slides.length) {

        currentSlide = 0;

    }


    /*
       Go to last slide
       before the first slide.
    */

    else if (index < 0) {

        currentSlide =
            slides.length - 1;

    }


    /*
       Normal slide number.
    */

    else {

        currentSlide = index;

    }


    /*
       Hide every slide.
    */

    slides.forEach(function (slide) {

        slide.classList.remove("active");

    });


    /*
       Show only current slide.
    */

    slides[currentSlide]
        .classList.add("active");

}


/*
   Previous / Next button
*/

function changeSlide(direction) {

    showSlide(
        currentSlide + direction
    );

}


/*
   Start slider
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showSlide(currentSlide);

    }
);


/* =====================================================
   AUTOMATIC SLIDER
   ===================================================== */

setInterval(function () {

    const slides =
        document.querySelectorAll(".slide");

    if (slides.length > 1) {

        changeSlide(1);

    }

}, 5000);


/* =====================================================
   FAQ
   ===================================================== */

let faqData = [];


/*
   Manual FAQ toggle
*/

function toggleFAQ(button) {

    const item =
        button.parentElement;

    const answer =
        item.querySelector(".faq-answer");

    const icon =
        button.querySelector(".faq-icon");


    /*
       Close other FAQ items.
    */

    document
        .querySelectorAll(".faq-item")
        .forEach(function (otherItem) {

            if (otherItem !== item) {

                otherItem.classList
                    .remove("active");

                const otherIcon =
                    otherItem
                        .querySelector(".faq-icon");

                if (otherIcon) {

                    otherIcon.textContent = "+";

                }

            }

        });


    /*
       Toggle current item.
    */

    item.classList.toggle("active");


    if (
        item.classList.contains("active")
    ) {

        if (icon) {
            icon.textContent = "−";
        }

    }

    else {

        if (icon) {
            icon.textContent = "+";
        }

    }

}


/* =====================================================
   FETCH FAQ DATA
   ===================================================== */

async function fetchFAQs() {

    const faqContainer =
        document.getElementById("faqContainer");

    const faqSearch =
        document.getElementById("faqSearch");


    /*
       If FAQ page is not open,
       do nothing.
    */

    if (!faqContainer) {

        return;

    }


    try {

        const response =
            await fetch("data/faqs.json");


        if (!response.ok) {

            throw new Error(
                "Unable to load FAQs"
            );

        }


        faqData =
            await response.json();


        displayFAQs(faqData);

    }


    catch (error) {

        console.error(error);

        faqContainer.innerHTML =
            "<p>Unable to load FAQs.</p>";

    }


    /*
       FAQ Search
    */

    if (faqSearch) {

        faqSearch.addEventListener(
            "input",
            function () {

                const searchText =
                    faqSearch.value
                        .toLowerCase();


                const filteredFAQs =
                    faqData.filter(
                        function (faq) {

                            return (

                                faq.question
                                    .toLowerCase()
                                    .includes(searchText)

                                ||

                                faq.answer
                                    .toLowerCase()
                                    .includes(searchText)

                            );

                        }
                    );


                displayFAQs(filteredFAQs);

            }
        );

    }

}


/* =====================================================
   DISPLAY FAQS
   ===================================================== */

function displayFAQs(faqs) {

    const faqContainer =
        document.getElementById(
            "faqContainer"
        );


    if (!faqContainer) {

        return;

    }


    faqContainer.innerHTML = "";


    /*
       No FAQ result.
    */

    if (faqs.length === 0) {

        faqContainer.innerHTML =
            "<p>No FAQ found.</p>";

        return;

    }


    /*
       Create each FAQ.
    */

    faqs.forEach(function (faq) {


        const faqItem =
            document.createElement("div");

        faqItem.className =
            "faq-item";


        const question =
            document.createElement("div");

        question.className =
            "faq-question";


        question.innerHTML =

            `<span>${faq.question}</span>
             <span class="faq-icon">+</span>`;


        const answer =
            document.createElement("div");

        answer.className =
            "faq-answer";


        answer.textContent =
            faq.answer;


        faqItem.appendChild(question);

        faqItem.appendChild(answer);


        /*
           FAQ click event.
        */

        question.addEventListener(
            "click",
            function () {


                /*
                   Close all other FAQs.
                */

                document
                    .querySelectorAll(".faq-item")
                    .forEach(function (item) {

                        if (item !== faqItem) {

                            item.classList
                                .remove("active");


                            const icon =
                                item.querySelector(
                                    ".faq-icon"
                                );


                            if (icon) {

                                icon.textContent =
                                    "+";

                            }

                        }

                    });


                /*
                   Toggle current FAQ.
                */

                faqItem.classList.toggle(
                    "active"
                );


                const icon =
                    faqItem.querySelector(
                        ".faq-icon"
                    );


                if (
                    faqItem.classList.contains(
                        "active"
                    )
                ) {

                    icon.textContent = "−";

                }

                else {

                    icon.textContent = "+";

                }

            }
        );


        faqContainer.appendChild(
            faqItem
        );

    });

}


/* =====================================================
   START FAQ
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        fetchFAQs();

    }
);
/* =====================================================
   STUDENT REGISTRATION
   ===================================================== */

const registrationForm = document.getElementById("registrationForm");

if (registrationForm) {

    registrationForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let isValid = true;


        /* =========================
           GET VALUES
           ========================= */

        const name =
            document.getElementById("studentName").value.trim();

        const email =
            document.getElementById("studentEmail").value.trim();

        const mobile =
            document.getElementById("mobile").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const course =
            document.getElementById("course").value;

        const year =
            document.getElementById("yearOfStudy").value;

        const gender =
            document.querySelector(
                'input[name="gender"]:checked'
            );

        const terms =
            document.getElementById("terms").checked;


        /* =========================
           REGULAR EXPRESSIONS
           ========================= */

        const namePattern =
            /^[A-Za-z ]{3,50}$/;

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const mobilePattern =
            /^[6-9][0-9]{9}$/;

        const passwordPattern =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


        /* =========================
           CLEAR ERRORS
           ========================= */

        document.querySelectorAll(".error-message")
            .forEach(function(error) {
                error.textContent = "";
            });


        /* =========================
           NAME VALIDATION
           ========================= */

        if (!namePattern.test(name)) {

            document.getElementById("nameError").textContent =
                "Please enter a valid name.";

            isValid = false;
        }


        /* =========================
           EMAIL VALIDATION
           ========================= */

        if (!emailPattern.test(email)) {

            document.getElementById("emailError").textContent =
                "Please enter a valid email address.";

            isValid = false;
        }


        /* =========================
           MOBILE VALIDATION
           ========================= */

        if (!mobilePattern.test(mobile)) {

            document.getElementById("mobileError").textContent =
                "Enter a valid 10-digit mobile number.";

            isValid = false;
        }


        /* =========================
           PASSWORD VALIDATION
           ========================= */

        if (!passwordPattern.test(password)) {

            document.getElementById("passwordError").textContent =
                "Password must be 8+ characters with a letter, number and special character.";

            isValid = false;
        }


        /* =========================
           CONFIRM PASSWORD
           ========================= */

        if (password !== confirmPassword) {

            document.getElementById("confirmPasswordError").textContent =
                "Passwords do not match.";

            isValid = false;
        }


        /* =========================
           COURSE
           ========================= */

        if (course === "") {

            document.getElementById("courseError").textContent =
                "Please select your course.";

            isValid = false;
        }


        /* =========================
           YEAR
           ========================= */

        if (year === "") {

            document.getElementById("yearError").textContent =
                "Please select your year.";

            isValid = false;
        }


        /* =========================
           GENDER
           ========================= */

        if (!gender) {

            document.getElementById("genderError").textContent =
                "Please select your gender.";

            isValid = false;
        }


        /* =========================
           TERMS
           ========================= */

        if (!terms) {

            document.getElementById("termsError").textContent =
                "You must accept the Terms and Conditions.";

            isValid = false;
        }


        /* =========================
           SUCCESS
           ========================= */

        if (isValid) {

            const message =
                document.getElementById("registerMessage");

            message.innerHTML = `
                <div class="success-message">
                    <span class="success-icon">✓</span>
                    <div>
                        <strong>Registration Successful!</strong>
                        <p>
                            Your StudentHub account has been
                            created successfully.
                        </p>
                    </div>
                </div>
            `;

            message.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            /* Clear form */

            registrationForm.reset();

        }

    });

}