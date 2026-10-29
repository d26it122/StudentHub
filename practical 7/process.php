
<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: register.html");
    exit;
}

function clean($value) {
    return trim((string)$value);
}

$name = clean($_POST["studentName"] ?? "");
$email = clean($_POST["email"] ?? "");
$roll = clean($_POST["roll"] ?? "");
$mobile = clean($_POST["mobile"] ?? "");
$course = clean($_POST["course"] ?? "");
$semester = clean($_POST["semester"] ?? "");
$gender = clean($_POST["gender"] ?? "");
$password = $_POST["password"] ?? "";
$confirmPassword = $_POST["confirmPassword"] ?? "";
$terms = $_POST["terms"] ?? "";

$errors = [];

if (!preg_match("/^[A-Za-z ]+$/", $name)) {
    $errors[] = "Enter a valid full name.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Enter a valid email address.";
}

if ($roll === "") {
    $errors[] = "Roll number is required.";
}

if (!preg_match("/^[6-9][0-9]{9}$/", $mobile)) {
    $errors[] = "Enter a valid 10-digit mobile number.";
}

$allowedCourses = [
    "B.Tech IT", "B.Tech CSE", "B.Tech CE", "B.Tech ECE"
];

$allowedSemesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
$allowedGenders = ["Male", "Female", "Other"];

if (!in_array($course, $allowedCourses, true)) {
    $errors[] = "Select a valid course.";
}

if (!in_array($semester, $allowedSemesters, true)) {
    $errors[] = "Select a valid semester.";
}

if (!in_array($gender, $allowedGenders, true)) {
    $errors[] = "Select a valid gender.";
}

if (
    strlen($password) < 8 ||
    !preg_match("/[A-Z]/", $password) ||
    !preg_match("/[a-z]/", $password) ||
    !preg_match("/[0-9]/", $password) ||
    !preg_match("/[^A-Za-z0-9]/", $password)
) {
    $errors[] = "Password must contain at least 8 characters, including uppercase, lowercase, number and special character.";
}

if ($password !== $confirmPassword) {
    $errors[] = "Passwords do not match.";
}

if ($terms !== "accepted") {
    $errors[] = "Please accept the Terms and Conditions.";
}

if (!empty($errors)) {
    http_response_code(400);
    echo "<h2>Registration failed</h2><ul>";

    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error, ENT_QUOTES, "UTF-8") . "</li>";
    }

    echo "</ul><a href='register.html'>Go back to registration</a>";
    exit;
}

$dataDirectory = __DIR__ . "/data";

$dataDirectory = __DIR__ . DIRECTORY_SEPARATOR . "data";
$file = $dataDirectory . DIRECTORY_SEPARATOR . "registrations.csv";

// Create the data directory if it does not exist.
if (!is_dir($dataDirectory)) {
    if (!mkdir($dataDirectory, 0775, true)) {
        die("Error: Could not create data folder at: " .
            htmlspecialchars($dataDirectory));
    }
}

// Open the CSV file for writing.
$handle = fopen($file, "a+");

if ($handle === false) {
    die("Error: Cannot open registration file: " .
        htmlspecialchars($file) .
        ". Check folder permissions.");
}

if (!flock($handle, LOCK_EX)) {
    fclose($handle);
    die("Error: Could not lock registration file.");
}

// Check whether the file is empty.
fseek($handle, 0, SEEK_END);
$isEmpty = ftell($handle) === 0;

if ($isEmpty) {
    fputcsv($handle, [
        "Full Name",
        "Email",
        "Roll Number",
        "Mobile",
        "Course",
        "Semester",
        "Gender",
        "Registered At",
        "Password Hash"
    ]);
}

// Save the student details and hash the password.
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$saved = fputcsv($handle, [
    $name,
    $email,
    $roll,
    $mobile,
    $course,
    $semester,
    $gender,
    date("Y-m-d H:i:s"),
    $passwordHash
]);

fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

if ($saved === false) {
    die("Error: Student data could not be written to the CSV file.");
}

// Verify that the saved file contains data before redirecting.
if (!file_exists($file) || filesize($file) === 0) {
    die("Error: Registration file was not created correctly.");
}

header("Location: students.php?registered=1");
exit;
