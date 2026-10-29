<?php
require_once __DIR__ . "/db_connect.php";

function e($v) {
    return htmlspecialchars((string)($v ?? ""), ENT_QUOTES, "UTF-8");
}

$events = [];
$dbError = "";

try {
    // Check whether the events table exists.
    $check = $pdo->query("SHOW TABLES LIKE 'events'");

    if ($check->fetchColumn()) {
        $sql = "SELECT event_id, title, event_date, location, category, description
                FROM events
                ORDER BY event_date ASC";
        $events = $pdo->query($sql)->fetchAll();
    } else {
        $dbError = "The 'events' table was not found in the studenthub database. Please check your database tables in phpMyAdmin.";
    }
} catch (PDOException $ex) {
    $dbError = "Unable to load events. Please check the table and column names in your database.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Database Events</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <div class="logo-area">
        <img src="charusat_logo.jpg" alt="CHARUSAT Logo">
        <div class="logo-text">
            <h1>StudentHub</h1>
            <p>Your Smart Student Management Portal</p>
        </div>
    </div>
</header>

<nav>
    <button class="hamburger" onclick="toggleMenu()" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    <div id="navLinks" class="nav-links">
        <a href="index.html">Home</a>
        <a href="register.html">Register</a>
        <a href="events.html">JSON Events</a>
        <a href="events_db.php" aria-current="page">Database Events</a>
        <a href="view_students_db.php">Registered Students</a>
        <button id="themeButton" class="theme-button" onclick="toggleTheme()">🌙 Dark Mode</button>
    </div>
</nav>

<main class="page-main">
    <section class="page-intro">
        <p class="eyebrow">PRACTICAL 8 · MYSQL SELECT</p>
        <h2>College Events</h2>
        <p>These events are loaded from the MySQL database.</p>
    </section>

    <section class="content-panel">
        <h3>Events in Database</h3>

        <?php if (isset($_GET["registered"])): ?>
            <p class="form-message success">
                Event registration saved successfully.
            </p>
        <?php endif; ?>

        <?php if ($dbError !== ""): ?>

            <p class="form-message">
                <?php echo e($dbError); ?>
            </p>

        <?php elseif (!$events): ?>

            <p>No events found in the database. Add events to the events table first.</p>

        <?php else: ?>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Register</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($events as $event): ?>
                            <tr>
                                <td><?php echo e($event["title"]); ?></td>
                                <td><?php echo e($event["event_date"]); ?></td>
                                <td><?php echo e($event["location"]); ?></td>
                                <td><?php echo e($event["category"]); ?></td>
                                <td><?php echo e($event["description"]); ?></td>
                                <td>
                                    <form action="process_event_registration_db.php" method="post">
                                        <input
                                            type="hidden"
                                            name="event_id"
                                            value="<?php echo e($event["event_id"]); ?>"
                                        >

                                        <label for="email-<?php echo e($event["event_id"]); ?>">
                                            Student email
                                        </label>

                                        <input
                                            id="email-<?php echo e($event["event_id"]); ?>"
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="registered email"
                                        >

                                        <button class="button" type="submit">Register</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

        <?php endif; ?>

        <p class="form-footer">
            Register a student first before registering them for an event.
            <a href="register.html">Student registration</a>.
        </p>
    </section>
</main>

<footer>
    <p>© <span id="year"></span> StudentHub</p>
</footer>

<script src="script.js"></script>
</body>
</html>