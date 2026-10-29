```php
<?php
require_once __DIR__ . "/db_connect.php";

$sql = "SELECT
            id,
            name,
            email,
            mobile,
            `course id` AS course_id,
            `year`,
            gender
        FROM student1
        ORDER BY id DESC";

$students = $pdo->query($sql)->fetchAll();

function e($value) {
    return htmlspecialchars(
        (string)($value ?? ""),
        ENT_QUOTES,
        "UTF-8"
    );
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Registered Students</title>
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
    <button class="hamburger" onclick="toggleMenu()"
            aria-label="Toggle navigation" aria-expanded="false">☰</button>

    <div id="navLinks" class="nav-links">
        <a href="index.html">Home</a>
        <a href="register_db.html">Register</a>
        <a href="events_db.php">Database