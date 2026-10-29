document.addEventListener("DOMContentLoaded", () => {
    // Automatically update the footer year.
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Restore the saved theme.
    try {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    } catch (error) {
        console.warn("Theme preference could not be loaded.");
    }

    updateThemeButton();
    showSlide(0);

    // Configuration for each page that loads JSON data.
    const pageConfigs = {
        events: {
            file: "data/events.json",
            container: "eventsContainer",
            pagination: "eventsPagination",
            search: "eventSearch",
            filter: "eventFilter",
            sort: "eventSort",
            pageSize: "eventPageSize",
            count: "eventCount",
            category: "eventType",
            fields: [
                "title", "description", "eventType",
                "date", "venue", "status"
            ],
            page: 1,
            data: []
        },

        students: {
            file: "data/students.json",
            container: "studentsContainer",
            pagination: "studentsPagination",
            search: "studentSearch",
            filter: "studentFilter",
            sort: "studentSort",
            pageSize: "studentPageSize",
            count: "studentCount",
            category: "course",
            fields: [
                "name", "rollNo", "course",
                "semester", "email"
            ],
            page: 1,
            data: []
        },

        notices: {
            file: "data/notices.json",
            container: "noticesContainer",
            pagination: "noticesPagination",
            search: "noticeSearch",
            filter: "noticeFilter",
            sort: "noticeSort",
            pageSize: "noticePageSize",
            count: "noticeCount",
            category: "category",
            fields: [
                "title", "description", "category",
                "postedDate", "deadline", "priority"
            ],
            page: 1,
            data: []
        },

        faqs: {
            file: "data/faqs.json",
            container: "faqContainer",
            pagination: "faqPagination",
            search: "faqSearch",
            filter: "faqFilter",
            sort: "faqSort",
            pageSize: "faqPageSize",
            count: "faqCount",
            category: "category",
            fields: ["question", "answer", "category"],
            page: 1,
            data: []
        }
    };

    // Make the configuration available to pagination controls.
    window.studentHubSections = pageConfigs;

    // Only load data for the section present on the current page.
    Object.keys(pageConfigs).forEach(name => {
        const section = pageConfigs[name];

        if (!document.getElementById(section.container)) {
            return;
        }

        // Update results whenever search, filter, sort or page size changes.
        [
            section.search,
            section.filter,
            section.sort,
            section.pageSize
        ].forEach(id => {
            const element = document.getElementById(id);

            if (!element) return;

            element.addEventListener("input", () => {
                section.page = 1;
                renderSection(name);
            });

            element.addEventListener("change", () => {
                section.page = 1;
                renderSection(name);
            });
        });

        loadSection(name);
    });

    // Highlight the current navigation link.
    const currentPage = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
        if (link.dataset.page === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
});

/* =====================================
   NAVIGATION AND THEME
   ===================================== */

function toggleMenu() {
    const links = document.getElementById("navLinks");
    const button = document.querySelector(".hamburger");

    if (!links) return;

    links.classList.toggle("active");

    if (button) {
        button.setAttribute(
            "aria-expanded",
            String(links.classList.contains("active"))
        );
    }
}

function updateThemeButton() {
    const button = document.getElementById("themeButton");

    if (!button) return;

    button.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    try {
        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }

    updateThemeButton();
}

/* =====================================
   NOTIFICATION AND MODAL
   ===================================== */

function closeNotification() {
    const notification = document.getElementById("notification");

    if (notification) {
        notification.style.display = "none";
    }
}

function openModal() {
    const modal = document.getElementById("myModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function closeModal() {
    const modal = document.getElementById("myModal");

    if (modal) {
        modal.style.display = "none";
    }
}

window.addEventListener("click", event => {
    const modal = document.getElementById("myModal");

    if (modal && event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});

/* =====================================
   HOME PAGE SLIDER
   ===================================== */

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll(".slider-container .slide");

    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
    });
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

/* =====================================
   HOME PAGE FAQ ACCORDION
   ===================================== */

function toggleFAQ(button) {
    const item = button.closest(".faq-section .faq-item");

    if (!item) return;

    const wasActive = item.classList.contains("active");

    document.querySelectorAll(".faq-section .faq-item").forEach(other => {
        other.classList.remove("active");

        const icon = other.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";

        const question = other.querySelector(".faq-question");
        if (question) {
            question.setAttribute("aria-expanded", "false");
        }
    });

    if (!wasActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");

        const icon = button.querySelector(".faq-icon");
        if (icon) icon.textContent = "−";
    }
}

/* =====================================
   FETCH API
   ===================================== */

async function fetchJSON(file) {
    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} loading ${file}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(`${file} must contain a JSON array.`);
    }

    return data;
}

async function loadSection(name) {
    const section = window.studentHubSections[name];
    const container = document.getElementById(section.container);

    if (!container) return;

    container.innerHTML =
        '<p class="practical6-message">Loading data...</p>';

    try {
        // Load records from the matching JSON file.
        section.data = await fetchJSON(section.file);

        const count = document.getElementById(section.count);

        if (count) {
            count.textContent = section.data.length;
        }

        populateFilter(section);
        renderSection(name);
    } catch (error) {
        console.error("StudentHub data loading error:", error);

        container.innerHTML = `
            <p class="practical6-message practical6-error">
                Unable to load data. Check the JSON file path and run
                StudentHub using VS Code Live Server.
            </p>
        `;

        const count = document.getElementById(section.count);
        if (count) count.textContent = "0";

        const pagination = document.getElementById(section.pagination);
        if (pagination) pagination.innerHTML = "";
    }
}

/* =====================================
   DYNAMIC FILTER OPTIONS
   ===================================== */

function populateFilter(section) {
    const select = document.getElementById(section.filter);

    if (!select) return;

    const previousValue = select.value;

    const values = [
        ...new Set(
            section.data
                .map(item => item[section.category])
                .filter(value => value != null && String(value).trim() !== "")
                .map(String)
        )
    ].sort((a, b) => a.localeCompare(b));

    select.innerHTML = '<option value="all">All categories</option>';

    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });

    if (values.includes(previousValue)) {
        select.value = previousValue;
    }
}

/* =====================================
   SAFE HTML AND SORTING HELPERS
   ===================================== */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function recordName(item) {
    return String(item.name || item.title || item.question || "");
}

function recordDate(item, name) {
    let value = "";

    if (name === "events") {
        value = item.date;
    } else if (name === "notices") {
        value = item.postedDate;
    } else {
        value = item.date || item.postedDate;
    }

    const timestamp = Date.parse(value || "");

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

/* =====================================
   SEARCH, FILTER, SORT AND PAGINATION
   ===================================== */

function renderSection(name) {
    const section = window.studentHubSections[name];
    const container = document.getElementById(section.container);

    if (!container) return;

    const search = (
        document.getElementById(section.search)?.value || ""
    ).trim().toLowerCase();

    const category =
        document.getElementById(section.filter)?.value || "all";

    const sort =
        document.getElementById(section.sort)?.value || "name-asc";

    const pageSize = Math.max(
        1,
        Number(document.getElementById(section.pageSize)?.value || 5)
    );

    // Search across all relevant fields.
    let rows = section.data.filter(item => {
        const searchableText = section.fields
            .map(field => item[field] ?? "")
            .join(" ")
            .toLowerCase();

        return searchableText.includes(search);
    });

    // Filter by selected category, course or event type.
    if (category !== "all") {
        rows = rows.filter(item =>
            String(item[section.category] ?? "") === category
        );
    }

    // Sort records.
    rows.sort((a, b) => {
        if (sort === "name-asc") {
            return recordName(a).localeCompare(recordName(b));
        }

        if (sort === "name-desc") {
            return recordName(b).localeCompare(recordName(a));
        }

        if (sort === "date-asc") {
            return recordDate(a, name) - recordDate(b, name);
        }

        if (sort === "date-desc") {
            return recordDate(b, name) - recordDate(a, name);
        }

        return 0;
    });

    // Calculate pagination.
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    section.page = Math.min(section.page, totalPages);

    const startIndex = (section.page - 1) * pageSize;
    const visibleRows = rows.slice(startIndex, startIndex + pageSize);

    // Display results.
    if (!visibleRows.length) {
        container.innerHTML = `
            <p class="practical6-message">No matching records found.</p>
        `;
    } else if (name === "faqs") {
        container.innerHTML = visibleRows.map(renderFAQ).join("");
    } else {
        container.innerHTML = renderTable(name, visibleRows);
    }

    renderPagination(name, totalPages, total);
}

/* =====================================
   TABLE RENDERING
   ===================================== */

function tag(value) {
    if (value == null || value === "") {
        return "—";
    }

    return `<span class="data-tag">${escapeHTML(value)}</span>`;
}

function renderTable(name, rows) {
    const definitions = {
        events: {
            headings: ["Event", "Category", "Date", "Venue", "Status"],

            cells: item => `
                <td>
                    <strong>${escapeHTML(item.title)}</strong>
                    <small>${escapeHTML(item.description)}</small>
                </td>
                <td>${tag(item.eventType)}</td>
                <td>${escapeHTML(item.date || "—")}</td>
                <td>${escapeHTML(item.venue || "—")}</td>
                <td>${tag(item.status)}</td>
            `
        },

        students: {
            headings: [
                "Student", "Roll Number", "Course", "Semester", "Email"
            ],

            cells: item => {
                const initials = String(item.name || "?")
                    .trim()
                    .split(/\s+/)
                    .map(word => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                return `
                    <td>
                        <span class="student-avatar">${escapeHTML(initials)}</span>
                        <strong>${escapeHTML(item.name)}</strong>
                    </td>
                    <td>${escapeHTML(item.rollNo || "—")}</td>
                    <td>${tag(item.course)}</td>
                    <td>${escapeHTML(item.semester || "—")}</td>
                    <td>${escapeHTML(item.email || "—")}</td>
                `;
            }
        },

        notices: {
            headings: [
                "Notice", "Category", "Published", "Deadline", "Priority"
            ],

            cells: item => `
                <td>
                    <strong>${escapeHTML(item.title)}</strong>
                    <small>${escapeHTML(item.description)}</small>
                </td>
                <td>${tag(item.category)}</td>
                <td>${escapeHTML(item.postedDate || "—")}</td>
                <td>${escapeHTML(item.deadline || "—")}</td>
                <td>${tag(item.priority)}</td>
            `
        }
    };

    const definition = definitions[name];

    if (!definition) return "";

    const headings = definition.headings
        .map(heading => `<th>${escapeHTML(heading)}</th>`)
        .join("");

    const body = rows
        .map(item => `<tr>${definition.cells(item)}</tr>`)
        .join("");

    return `
        <div class="table-responsive">
            <table class="practical6-table">
                <thead><tr>${headings}</tr></thead>
                <tbody>${body}</tbody>
            </table>
        </div>
    `;
}

/* =====================================
   DYNAMIC FAQ RENDERING
   ===================================== */

function renderFAQ(item) {
    return `
        <div class="practical6-faq-item">
            <button
                class="practical6-faq-question"
                onclick="toggleDynamicFAQ(this)"
                aria-expanded="false"
            >
                <span>${escapeHTML(item.question)}</span>
                <span class="faq-icon">+</span>
            </button>

            <div class="practical6-faq-answer">
                <p>${escapeHTML(item.answer)}</p>
                <div class="faq-category">${tag(item.category)}</div>
            </div>
        </div>
    `;
}

function toggleDynamicFAQ(button) {
    const item = button.closest(".practical6-faq-item");

    if (!item) return;

    const wasActive = item.classList.contains("active");

    document.querySelectorAll(".practical6-faq-item").forEach(other => {
        other.classList.remove("active");

        const question = other.querySelector("button");
        if (question) {
            question.setAttribute("aria-expanded", "false");
        }

        const icon = other.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";
    });

    if (!wasActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");

        const icon = button.querySelector(".faq-icon");
        if (icon) icon.textContent = "−";
    }
}

/* =====================================
   PAGINATION CONTROLS
   ===================================== */

function renderPagination(name, totalPages, totalRecords) {
    const section = window.studentHubSections[name];
    const container = document.getElementById(section.pagination);

    if (!container) return;

    const pageSize = Number(
        document.getElementById(section.pageSize)?.value || 5
    );

    const start = totalRecords
        ? (section.page - 1) * pageSize + 1
        : 0;

    const end = Math.min(section.page * pageSize, totalRecords);

    container.innerHTML = `
        <span>Showing ${start}–${end} of ${totalRecords} records</span>

        <div class="practical6-page-buttons">
            <button
                type="button"
                ${section.page <= 1 ? "disabled" : ""}
                onclick="changePage('${name}', -1)"
            >← Previous</button>

            <span>Page ${section.page} of ${totalPages}</span>

            <button
                type="button"
                ${section.page >= totalPages ? "disabled" : ""}
                onclick="changePage('${name}', 1)"
            >Next →</button>
        </div>
    `;
}

function changePage(name, direction) {
    const section = window.studentHubSections[name];

    if (!section) return;

    section.page += direction;
    renderSection(name);
}
/* =====================================
   STUDENTHUB - SHARED PAGE FUNCTIONALITY
   Add after the existing script.js code
   ===================================== */

function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const hamburger = document.querySelector(".hamburger");

    if (!navLinks || !hamburger) return;

    const isOpen = navLinks.classList.toggle("active");

    hamburger.setAttribute("aria-expanded", String(isOpen));
}

function updateThemeButton() {
    const button = document.getElementById("themeButton");

    if (!button) return;

    const isDark = document.body.classList.contains("dark-mode");

    button.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }

    updateThemeButton();
}

function showFormMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message " + type;
}

document.addEventListener("DOMContentLoaded", () => {
    // Footer year.
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Restore the saved theme.
    try {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    } catch (error) {
        console.warn("Theme preference could not be restored.");
    }

    updateThemeButton();

    // Highlight the active navigation link.
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Registration form.
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!registerForm.reportValidity()) return;

            const message = document.getElementById("registerMessage");

            showFormMessage(
                message,
                "Form validated successfully. Account creation requires a backend.",
                "success"
            );
        });
    }

    // Login form.
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!loginForm.reportValidity()) return;

            showFormMessage(
                document.getElementById("loginMessage"),
                "Form validated. Connect a backend to authenticate users.",
                "success"
            );
        });
    }

    // Contact form.
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!contactForm.reportValidity()) return;

            showFormMessage(
                document.getElementById("contactStatus"),
                "Form validated. No message has been sent to a server.",
                "success"
            );

            contactForm.reset();
        });
    }

    // Feedback form.
    const feedbackForm = document.getElementById("feedbackForm");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!feedbackForm.reportValidity()) return;

            showFormMessage(
                document.getElementById("feedbackStatus"),
                "Thank you! Your form is valid, but the feedback has not been stored on a server.",
                "success"
            );

            feedbackForm.reset();
        });
    }

    // Faculty directory.
    const facultyContainer = document.getElementById("facultyContainer");
    const facultySearch = document.getElementById("facultySearch");

    if (facultyContainer) {
        loadFaculty(facultyContainer, facultySearch);
    }
});

async function loadFaculty(container, searchInput) {
    let facultyData = [];

    try {
        const response = await fetch("data/faculty.json");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Faculty JSON must contain an array.");
        }

        facultyData = data;
        renderFaculty(facultyData, container);

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.trim().toLowerCase();

                const filtered = facultyData.filter(faculty => {
                    return [
                        faculty.name,
                        faculty.department,
                        faculty.designation,
                        faculty.email
                    ].some(value =>
                        String(value || "").toLowerCase().includes(query)
                    );
                });

                renderFaculty(filtered, container);
            });
        }
    } catch (error) {
        console.error("Unable to load faculty:", error);

        container.innerHTML = `
            <div class="practical6-message practical6-error">
                Unable to load faculty information.
                Check data/faculty.json and run the project using Live Server.
            </div>
        `;
    }
}

function renderFaculty(facultyList, container) {
    container.replaceChildren();

    if (facultyList.length === 0) {
        const message = document.createElement("div");

        message.className = "practical6-message";
        message.textContent = "No faculty records found.";

        container.appendChild(message);
        return;
    }

    facultyList.forEach(faculty => {
        const card = document.createElement("article");
        card.className = "faculty-card";

        const name = document.createElement("h3");
        name.textContent = faculty.name || "Name not available";

        const designation = document.createElement("p");
        designation.textContent =
            "Designation: " + (faculty.designation || "Not specified");

        const department = document.createElement("p");
        department.textContent =
            "Department: " + (faculty.department || "Not specified");

        const email = document.createElement("p");
        email.textContent = "Email: ";

        if (faculty.email) {
            const emailLink = document.createElement("a");
            emailLink.href = "mailto:" + faculty.email;
            emailLink.textContent = faculty.email;
            email.appendChild(emailLink);
        } else {
            email.append("Not specified");
        }

        card.append(name, designation, department, email);
        container.appendChild(card);
    });
}