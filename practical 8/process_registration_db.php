<?php
require_once __DIR__ . "/db_connect.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: register.html");
    exit;
}

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$mobile = trim($_POST["mobile"] ?? "");
$courseId = filter_input(INPUT_POST, "course_id", FILTER_VALIDATE_INT);
$year = filter_input(INPUT_POST, "year", FILTER_VALIDATE_INT);
$gender = trim($_POST["gender"] ?? "");

if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || $mobile === "" ||
    !$courseId || !$year || $year < 1 || $year > 4 || $gender === "") {
    http_response_code(400);
    exit("Please enter valid details. Go back and check all fields.");
}

try {
    
$sql = "INSERT INTO student1
        (name, email, mobile, `course id`, `year`, gender)
        VALUES
        (:name, :email, :mobile, :course_id, :year, :gender)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":mobile" => $mobile,
        ":course_id" => $courseId,
        ":year" => $year,
        ":gender" => $gender
    ]);
    header("Location: view_students_db.php?registered=1");
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    exit("Database error: " .
        htmlspecialchars($e->getMessage(), ENT_QUOTES, "UTF-8"));
}
?>
