<?php
// Shared PDO connection for all StudentHub database pages.
$host = "localhost";
$dbname = "studenthub";
$username = "root";
$password = ""; // Default XAMPP MySQL password; change if yours is different.

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    exit("Database connection failed. Check db_connect.php and import studenthub_schema.sql.");
}
?>
