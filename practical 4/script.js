document.getElementById("year").textContent =
    new Date().getFullYear();

function toggleMenu() {

    const navLinks = document.getElementById("navLinks");

    navLinks.classList.toggle("active");

}
/* =====================================================
   COLLAPSIBLE FAQ
   ===================================================== */

function toggleFAQ(button) {

    const item = button.parentElement;

    const answer =
        item.querySelector(".faq-answer");

    const icon =
        button.querySelector(".faq-icon");


    /* Close other FAQs */

    const allItems =
        document.querySelectorAll(".faq-item");

    allItems.forEach(function(otherItem) {

        if (otherItem !== item) {

            otherItem.classList.remove("active");

            const otherIcon =
                otherItem.querySelector(".faq-icon");

            if (otherIcon) {
                otherIcon.textContent = "+";
            }

        }

    });


    /* Toggle current FAQ */

    item.classList.toggle("active");


    if (item.classList.contains("active")) {

        icon.textContent = "−";

    } else {

        icon.textContent = "+";

    }

}

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const button = document.querySelector(".theme-button");

    if (document.body.classList.contains("dark-mode")) {

        button.innerHTML = "☀️ Light Mode";

    } else {

        button.innerHTML = "🌙 Dark Mode";

    }
}


const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    document.getElementById("themeButton").textContent =
        "☀️ Light Mode";

}


function closeNotification() {

    const notification =
        document.getElementById("notification");

    notification.style.display = "none";

}


function openModal() {

    const modal =
        document.getElementById("myModal");

    modal.style.display = "flex";

}


function closeModal() {

    const modal =
        document.getElementById("myModal");

    modal.style.display = "none";

}


// Close modal when user clicks outside modal content

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("myModal");

    if (event.target === modal) {

        modal.style.display = "none";

    }

});


// Close modal using Escape key

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeModal();

    }

});


// =====================================================
// 5. IMAGE / CONTENT SLIDER
// =====================================================

let currentSlide = 0;


function showSlide(index) {

    const slides =
        document.querySelectorAll(".slide");


    // If there are no slides

    if (slides.length === 0) {
        return;
    }


    // If index goes beyond last slide

    if (index >= slides.length) {

        currentSlide = 0;

    }


    // If index goes before first slide

    else if (index < 0) {

        currentSlide = slides.length - 1;

    }

    else {

        currentSlide = index;

    }


    // Hide all slides

    slides.forEach(function(slide) {

        slide.classList.remove("active");

    });


    // Show current slide

    slides[currentSlide].classList.add("active");

}


// Change slide

function changeSlide(direction) {

    showSlide(currentSlide + direction);

}


let faqData = [];


// Fetch FAQ data

async function fetchFAQs() {

    const faqContainer =
        document.getElementById("faqContainer");

    const faqSearch =
        document.getElementById("faqSearch");


    // If FAQ section does not exist

    if (!faqContainer) {
        return;
    }


    try {

        const response =
            await fetch("data/faqs.json");


        if (!response.ok) {

            throw new Error("Unable to load FAQs");

        }


        faqData = await response.json();


        displayFAQs(faqData);


    }

    catch (error) {

        console.error(error);

        faqContainer.innerHTML =
            "<p>Unable to load FAQs.</p>";

    }


    // FAQ search

    if (faqSearch) {

        faqSearch.addEventListener("input", function() {

            const searchText =
                faqSearch.value.toLowerCase();


            const filteredFAQs =
                faqData.filter(function(faq) {

                    return (
                        faq.question
                            .toLowerCase()
                            .includes(searchText)
                        ||
                        faq.answer
                            .toLowerCase()
                            .includes(searchText)
                    );

                });


            displayFAQs(filteredFAQs);

        });

    }

}


// Display FAQs dynamically

function displayFAQs(faqs) {

    const faqContainer =
        document.getElementById("faqContainer");


    if (!faqContainer) {
        return;
    }


    faqContainer.innerHTML = "";


    // No results

    if (faqs.length === 0) {

        faqContainer.innerHTML =
            "<p>No FAQ found.</p>";

        return;

    }


    faqs.forEach(function(faq) {

        // Create FAQ item

        const faqItem =
            document.createElement("div");

        faqItem.className = "faq-item";


        // Create question

        const question =
            document.createElement("div");

        question.className = "faq-question";

        question.innerHTML =
            `<span>${faq.question}</span>
             <span class="faq-icon">+</span>`;


        // Create answer

        const answer =
            document.createElement("div");

        answer.className = "faq-answer";

        answer.textContent =
            faq.answer;


        // Add question and answer

        faqItem.appendChild(question);

        faqItem.appendChild(answer);


        // Click event

        question.addEventListener("click", function() {

            // Close other FAQs

            document
                .querySelectorAll(".faq-item")
                .forEach(function(item) {

                    if (item !== faqItem) {

                        item.classList.remove("active");

                        const icon =
                            item.querySelector(".faq-icon");

                        if (icon) {
                            icon.textContent = "+";
                        }

                    }

                });


            // Toggle current FAQ

            faqItem.classList.toggle("active");


            const icon =
                faqItem.querySelector(".faq-icon");


            if (faqItem.classList.contains("active")) {

                icon.textContent = "−";

            } else {

                icon.textContent = "+";

            }

        });


        faqContainer.appendChild(faqItem);

    });

}


// =====================================================
// START FAQ
// =====================================================

fetchFAQs();