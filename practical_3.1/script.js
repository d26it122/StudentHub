// =====================================================
// STUDENTHUB JAVASCRIPT
// PRACTICAL 4 + PRACTICAL 6
// =====================================================


// =====================================================
// 1. CURRENT YEAR
// =====================================================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// =====================================================
// 2. HAMBURGER MENU
// =====================================================

function toggleMenu() {

    const navLinks =
        document.getElementById("navLinks");

    if (navLinks) {

        navLinks.classList.toggle("active");

    }

}


// =====================================================
// 3. LIGHT / DARK MODE
// =====================================================

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const themeButton =
        document.querySelector(".theme-button");


    if (document.body.classList.contains("dark-mode")) {

        if (themeButton) {
            themeButton.textContent = "☀️ Light Mode";
        }

        localStorage.setItem("theme", "dark");

    } else {

        if (themeButton) {
            themeButton.textContent = "🌙 Dark Mode";
        }

        localStorage.setItem("theme", "light");

    }

}


// =====================================================
// REMEMBER THEME
// =====================================================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    const themeButton =
        document.querySelector(".theme-button");

    if (themeButton) {

        themeButton.textContent =
            "☀️ Light Mode";

    }

}


// =====================================================
// 4. NOTIFICATION
// =====================================================

function closeNotification() {

    const notification =
        document.getElementById("notification");

    if (notification) {

        notification.style.display = "none";

    }

}


// =====================================================
// 5. MODAL
// =====================================================

function openModal() {

    const modal =
        document.getElementById("myModal");

    if (modal) {

        modal.style.display = "block";

    }

}


function closeModal() {

    const modal =
        document.getElementById("myModal");

    if (modal) {

        modal.style.display = "none";

    }

}


window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("myModal");

    if (modal && event.target === modal) {

        modal.style.display = "none";

    }

});


// =====================================================
// 6. IMAGE SLIDER
// =====================================================

let currentSlide = 0;


function showSlide(index) {

    const slides =
        document.querySelectorAll(".slide");

    if (slides.length === 0) {

        return;

    }


    if (index >= slides.length) {

        currentSlide = 0;

    } else if (index < 0) {

        currentSlide =
            slides.length - 1;

    } else {

        currentSlide = index;

    }


    slides.forEach(function(slide) {

        slide.classList.remove("active");

    });


    slides[currentSlide]
        .classList.add("active");

}


function changeSlide(direction) {

    showSlide(
        currentSlide + direction
    );

}


showSlide(0);


// =====================================================
// 7. PROFILE EDIT
// =====================================================

function editProfile() {

    alert(
        "Profile editing feature will be available soon."
    );

}


// =====================================================
// 8. REGISTRATION FORM VALIDATION
// =====================================================

const form =
    document.querySelector(
        ".form-container form"
    );


if (
    form &&
    document.getElementById("roll")
) {

    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name");

            const email =
                document.getElementById("email");

            const roll =
                document.getElementById("roll");

            const course =
                document.getElementById("course");

            const password =
                document.getElementById("password");


            if (
                name.value.trim() === "" ||
                email.value.trim() === "" ||
                roll.value.trim() === "" ||
                course.value === "Select Course" ||
                password.value.trim() === ""
            ) {

                alert(
                    "Please fill all the fields."
                );

                return;

            }


            if (password.value.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            alert(
                "Registration successful!"
            );

            form.reset();

        }
    );

}


// =====================================================
// PRACTICAL 6
// FETCH API
// =====================================================


// =====================================================
// 9. EVENTS
// =====================================================

let allEvents = [];

let currentEventPage = 1;

const eventsPerPage = 4;


// FETCH EVENTS

async function fetchEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                "data/events.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load events."
            );

        }


        allEvents =
            await response.json();


        displayEvents();


    } catch (error) {

        container.innerHTML =
            `<p>Unable to load events.</p>`;

        console.error(error);

    }

}


// DISPLAY EVENTS

function displayEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    if (!container) {

        return;

    }


    const searchInput =
        document.getElementById(
            "eventSearch"
        );

    const filterInput =
        document.getElementById(
            "eventFilter"
        );

    const sortInput =
        document.getElementById(
            "eventSort"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filter =
        filterInput
            ? filterInput.value
            : "all";


    const sort =
        sortInput
            ? sortInput.value
            : "dateAsc";


    // SEARCH

    let filteredEvents =
        allEvents.filter(function(event) {

            const matchesSearch =
                event.title
                    .toLowerCase()
                    .includes(search) ||
                event.description
                    .toLowerCase()
                    .includes(search);


            const matchesFilter =
                filter === "all" ||
                event.category === filter;


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    // SORT

    filteredEvents.sort(
        function(a, b) {

            if (sort === "titleAsc") {

                return a.title
                    .localeCompare(b.title);

            }


            if (sort === "titleDesc") {

                return b.title
                    .localeCompare(a.title);

            }


            if (sort === "dateDesc") {

                return new Date(b.date)
                    - new Date(a.date);

            }


            return new Date(a.date)
                - new Date(b.date);

        }
    );


    // PAGINATION

    const start =
        (currentEventPage - 1)
        * eventsPerPage;

    const end =
        start + eventsPerPage;


    const pageEvents =
        filteredEvents.slice(
            start,
            end
        );


    container.innerHTML = "";


    if (pageEvents.length === 0) {

        container.innerHTML =
            `<p>No events found.</p>`;

        document.getElementById(
            "pagination"
        ).innerHTML = "";

        return;

    }


    // CREATE EVENT CARDS

    pageEvents.forEach(
        function(event) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "event-card";


            card.innerHTML = `

                <div class="event-date">

                    <strong>
                        ${new Date(event.date)
                            .getDate()}
                    </strong>

                    <span>
                        ${new Date(event.date)
                            .toLocaleString(
                                "en",
                                { month: "short" }
                            )
                            .toUpperCase()}
                    </span>

                </div>


                <div>

                    <h3>
                        ${event.title}
                    </h3>

                    <p>
                        ${event.description}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${event.category}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${event.time}
                    </p>

                    <p>
                        <strong>Venue:</strong>
                        ${event.venue}
                    </p>

                </div>

            `;


            container.appendChild(card);

        }
    );


    createEventPagination(
        filteredEvents.length
    );

}


// EVENT PAGINATION

function createEventPagination(totalItems) {

    const pagination =
        document.getElementById(
            "pagination"
        );

    if (!pagination) {

        return;

    }


    const totalPages =
        Math.ceil(
            totalItems / eventsPerPage
        );


    pagination.innerHTML = "";


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent = i;


        if (i === currentEventPage) {

            button.classList.add(
                "active-page"
            );

        }


        button.addEventListener(
            "click",
            function() {

                currentEventPage = i;

                displayEvents();

            }
        );


        pagination.appendChild(button);

    }

}


// EVENT SEARCH

const eventSearch =
    document.getElementById(
        "eventSearch"
    );

if (eventSearch) {

    eventSearch.addEventListener(
        "input",
        function() {

            currentEventPage = 1;

            displayEvents();

        }
    );

}


// EVENT FILTER

const eventFilter =
    document.getElementById(
        "eventFilter"
    );

if (eventFilter) {

    eventFilter.addEventListener(
        "change",
        function() {

            currentEventPage = 1;

            displayEvents();

        }
    );

}


// EVENT SORT

const eventSort =
    document.getElementById(
        "eventSort"
    );

if (eventSort) {

    eventSort.addEventListener(
        "change",
        function() {

            currentEventPage = 1;

            displayEvents();

        }
    );

}


// RUN FETCH

fetchEvents();


// =====================================================
// 10. STUDENTS
// =====================================================

let allStudents = [];

let currentStudentPage = 1;

const studentsPerPage = 4;


// FETCH STUDENTS

async function fetchStudents() {

    const container =
        document.getElementById(
            "studentsContainer"
        );

    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                "data/students.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load students."
            );

        }


        allStudents =
            await response.json();


        displayStudents();


    } catch (error) {

        container.innerHTML =
            `<p>Unable to load students.</p>`;

        console.error(error);

    }

}


// DISPLAY STUDENTS

function displayStudents() {

    const container =
        document.getElementById(
            "studentsContainer"
        );

    if (!container) {

        return;

    }


    const searchInput =
        document.getElementById(
            "studentSearch"
        );

    const courseInput =
        document.getElementById(
            "studentCourse"
        );

    const sortInput =
        document.getElementById(
            "studentSort"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const course =
        courseInput
            ? courseInput.value
            : "all";


    const sort =
        sortInput
            ? sortInput.value
            : "nameAsc";


    let students =
        allStudents.filter(
            function(student) {

                const matchesSearch =
                    student.name
                        .toLowerCase()
                        .includes(search);


                const matchesCourse =
                    course === "all" ||
                    student.course === course;


                return (
                    matchesSearch &&
                    matchesCourse
                );

            }
        );


    // SORT

    students.sort(
        function(a, b) {

            if (sort === "nameDesc") {

                return b.name
                    .localeCompare(a.name);

            }


            if (sort === "semesterAsc") {

                return a.semester -
                    b.semester;

            }


            if (sort === "semesterDesc") {

                return b.semester -
                    a.semester;

            }


            return a.name
                .localeCompare(b.name);

        }
    );


    // PAGINATION

    const start =
        (currentStudentPage - 1)
        * studentsPerPage;

    const end =
        start + studentsPerPage;


    const pageStudents =
        students.slice(
            start,
            end
        );


    container.innerHTML = "";


    if (pageStudents.length === 0) {

        container.innerHTML =
            `<p>No students found.</p>`;

        return;

    }


    pageStudents.forEach(
        function(student) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <h3>
                    ${student.name}
                </h3>

                <p>
                    <strong>Email:</strong>
                    ${student.email}
                </p>

                <p>
                    <strong>Course:</strong>
                    ${student.course}
                </p>

                <p>
                    <strong>Semester:</strong>
                    ${student.semester}
                </p>

                <p>
                    <strong>City:</strong>
                    ${student.city}
                </p>

            `;


            container.appendChild(card);

        }
    );


    createStudentPagination(
        students.length
    );

}


// STUDENT PAGINATION

function createStudentPagination(
    totalItems
) {

    const pagination =
        document.getElementById(
            "studentPagination"
        );

    if (!pagination) {

        return;

    }


    const totalPages =
        Math.ceil(
            totalItems / studentsPerPage
        );


    pagination.innerHTML = "";


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent = i;


        if (i === currentStudentPage) {

            button.classList.add(
                "active-page"
            );

        }


        button.addEventListener(
            "click",
            function() {

                currentStudentPage = i;

                displayStudents();

            }
        );


        pagination.appendChild(button);

    }

}


// STUDENT SEARCH

const studentSearch =
    document.getElementById(
        "studentSearch"
    );

if (studentSearch) {

    studentSearch.addEventListener(
        "input",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );

}


// STUDENT COURSE FILTER

const studentCourse =
    document.getElementById(
        "studentCourse"
    );

if (studentCourse) {

    studentCourse.addEventListener(
        "change",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );

}


// STUDENT SORT

const studentSort =
    document.getElementById(
        "studentSort"
    );

if (studentSort) {

    studentSort.addEventListener(
        "change",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );

}


// RUN FETCH

fetchStudents();


// =====================================================
// 11. FAQ
// =====================================================

let allFAQs = [];


// FETCH FAQ

async function fetchFAQs() {

    const container =
        document.getElementById(
            "faqContainer"
        );

    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                "data/faqs.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load FAQs."
            );

        }


        allFAQs =
            await response.json();


        displayFAQs();


    } catch (error) {

        container.innerHTML =
            `<p>Unable to load FAQs.</p>`;

        console.error(error);

    }

}


// DISPLAY FAQ

function displayFAQs() {

    const container =
        document.getElementById(
            "faqContainer"
        );

    if (!container) {

        return;

    }


    const searchInput =
        document.getElementById(
            "faqSearch"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredFAQs =
        allFAQs.filter(
            function(faq) {

                return (
                    faq.question
                        .toLowerCase()
                        .includes(search) ||

                    faq.answer
                        .toLowerCase()
                        .includes(search)
                );

            }
        );


    container.innerHTML = "";


    if (filteredFAQs.length === 0) {

        container.innerHTML =
            `<p>No FAQ found.</p>`;

        return;

    }


    const faqContainer =
        document.createElement(
            "div"
        );

    faqContainer.className =
        "faq-container";


    filteredFAQs.forEach(
        function(faq) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "faq-item";


            item.innerHTML = `

                <button
                    class="faq-question">

                    <span>
                        ${faq.question}
                    </span>

                    <span class="faq-icon">
                        +
                    </span>

                </button>


                <div class="faq-answer">

                    <p>
                        ${faq.answer}
                    </p>

                </div>

            `;


            const question =
                item.querySelector(
                    ".faq-question"
                );


            question.addEventListener(
                "click",
                function() {

                    const allItems =
                        document.querySelectorAll(
                            ".faq-item"
                        );


                    allItems.forEach(
                        function(otherItem) {

                            if (
                                otherItem !== item
                            ) {

                                otherItem
                                    .classList
                                    .remove(
                                        "active"
                                    );

                                const icon =
                                    otherItem
                                        .querySelector(
                                            ".faq-icon"
                                        );

                                if (icon) {

                                    icon.textContent =
                                        "+";

                                }

                            }

                        }
                    );


                    item.classList.toggle(
                        "active"
                    );


                    const icon =
                        item.querySelector(
                            ".faq-icon"
                        );


                    if (
                        item.classList.contains(
                            "active"
                        )
                    ) {

                        icon.textContent = "−";

                    } else {

                        icon.textContent = "+";

                    }

                }
            );


            faqContainer.appendChild(
                item
            );

        }
    );


    container.appendChild(
        faqContainer
    );

}


// FAQ SEARCH

const faqSearch =
    document.getElementById(
        "faqSearch"
    );

if (faqSearch) {

    faqSearch.addEventListener(
        "input",
        function() {

            displayFAQs();

        }
    );

}


// RUN FETCH

fetchFAQs();


// =====================================================
// 12. NOTICES
// =====================================================

let allNotices = [];


// FETCH NOTICES

async function fetchNotices() {

    const container =
        document.getElementById(
            "noticesContainer"
        );

    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                "data/notices.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load notices."
            );

        }


        allNotices =
            await response.json();


        displayNotices();


    } catch (error) {

        container.innerHTML =
            `<p>Unable to load notices.</p>`;

        console.error(error);

    }

}


// DISPLAY NOTICES

function displayNotices() {

    const container =
        document.getElementById(
            "noticesContainer"
        );

    if (!container) {

        return;

    }


    const searchInput =
        document.getElementById(
            "noticeSearch"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const notices =
        allNotices.filter(
            function(notice) {

                return (
                    notice.title
                        .toLowerCase()
                        .includes(search) ||

                    notice.description
                        .toLowerCase()
                        .includes(search)
                );

            }
        );


    container.innerHTML = "";


    if (notices.length === 0) {

        container.innerHTML =
            `<p>No notices found.</p>`;

        return;

    }


    notices.forEach(
        function(notice) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "notice-card";


            card.innerHTML = `

                <h3>
                    ${notice.title}
                </h3>

                <p>
                    ${notice.description}
                </p>

                <p>
                    <strong>Type:</strong>
                    ${notice.type}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${notice.date}
                </p>

            `;


            container.appendChild(card);

        }
    );

}


// NOTICE SEARCH

const noticeSearch =
    document.getElementById(
        "noticeSearch"
    );

if (noticeSearch) {

    noticeSearch.addEventListener(
        "input",
        function() {

            displayNotices();

        }
    );

}


// RUN FETCH

fetchNotices();