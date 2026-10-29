<?php
require_once __DIR__ . "/db_connect.php";
if ($_SERVER["REQUEST_METHOD"] !== "POST") { header("Location: events_db.php"); exit; }
$email = trim($_POST["email"] ?? "");
$eventId = filter_input(INPUT_POST, "event_id", FILTER_VALIDATE_INT);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$eventId) { http_response_code(400); exit("Please provide a valid student email and event."); }
$studentStmt = $pdo->prepare("SELECT id FROM students WHERE email = :email");
$studentStmt->execute([":email" => $email]);
$student = $studentStmt->fetch();
if (!$student) { exit("No student was found with that email. Please register the student first. <a href='register.html'>Register student</a>"); }
$eventStmt = $pdo->prepare("SELECT event_id FROM events WHERE event_id = :id");
$eventStmt->execute([":id" => $eventId]);
if (!$eventStmt->fetch()) { http_response_code(404); exit("Event not found."); }
try {
    $stmt = $pdo->prepare("INSERT INTO registrations (student_id, event_id) VALUES (:student_id, :event_id)");
    $stmt->execute([":student_id" => $student["id"], ":event_id" => $eventId]);
    header("Location: events_db.php?registered=1"); exit;
} catch (PDOException $e) {
    if ($e->getCode() === "23000") { exit("This student is already registered for that event. <a href='events_db.php'>Back to events</a>"); }
    http_response_code(500); exit("Unable to register for the event. Check database setup.");
}
?>
