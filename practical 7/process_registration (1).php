<?php

// ========================================
// Practical 7 - PHP Form Processing
// StudentHub Registration
// ========================================

// ========================================
// 1. Check POST Request
// ========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Invalid request. Please submit the registration form.");
}

// ========================================
// 2. Get Form Data
// ========================================

$name = trim($_POST["studentName"] ?? "");
$email = trim($_POST["email"] ?? "");
$mobile = trim($_POST["mobile"] ?? "");
$password = $_POST["password"] ?? "";
$confirmPassword = $_POST["confirmPassword"] ?? "";
$course = trim($_POST["course"] ?? "");
$year = trim($_POST["year"] ?? "");
$gender = trim($_POST["gender"] ?? "");
$terms = isset($_POST["terms"]);

// ========================================
// 3. Server-Side Validation
// ========================================

$errors = [];

// Name validation
if ($name === "") {
    $errors[] = "Name is required.";
} elseif (!preg_match("/^[A-Za-z ]+$/", $name)) {
    $errors[] = "Name should contain letters and spaces only.";
}

// Email validation
if ($email === "") {
    $errors[] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

// Mobile validation
if ($mobile === "") {
    $errors[] = "Mobile number is required.";
} elseif (!preg_match("/^[6-9][0-9]{9}$/", $mobile)) {
    $errors[] = "Please enter a valid 10-digit Indian mobile number.";
}

// Password validation
if ($password === "") {
    $errors[] = "Password is required.";
} elseif (
    strlen($password) < 8 ||
    !preg_match("/[A-Z]/", $password) ||
    !preg_match("/[a-z]/", $password) ||
    !preg_match("/[0-9]/", $password) ||
    !preg_match('/[@$!%*?&]/', $password)
) {
    $errors[] = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
}

// Confirm password validation
if ($confirmPassword === "") {
    $errors[] = "Please confirm your password.";
} elseif ($password !== $confirmPassword) {
    $errors[] = "Passwords do not match.";
}

// Course validation
$allowedCourses = ["B.Tech IT", "B.Tech CE", "B.Tech CSE"];

if ($course === "") {
    $errors[] = "Please select your course.";
} elseif (!in_array($course, $allowedCourses, true)) {
    $errors[] = "Please select a valid course.";
}

// Year validation
$allowedYears = ["1", "2", "3", "4"];

if ($year === "") {
    $errors[] = "Please select your year.";
} elseif (!in_array($year, $allowedYears, true)) {
    $errors[] = "Please select a valid year.";
}

// Gender validation
$allowedGenders = ["Male", "Female", "Other"];

if ($gender === "") {
    $errors[] = "Please select your gender.";
} elseif (!in_array($gender, $allowedGenders, true)) {
    $errors[] = "Please select a valid gender.";
}

// Terms validation
if (!$terms) {
    $errors[] = "You must accept the Terms and Conditions.";
}

// ========================================
// 4. Sanitize Input Data
// ========================================

$name = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
$email = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
$mobile = htmlspecialchars($mobile, ENT_QUOTES, "UTF-8");
$course = htmlspecialchars($course, ENT_QUOTES, "UTF-8");
$year = htmlspecialchars($year, ENT_QUOTES, "UTF-8");
$gender = htmlspecialchars($gender, ENT_QUOTES, "UTF-8");

// ========================================
// 5. Display Validation Errors
// ========================================

if (!empty($errors)) {
    http_response_code(400);
    ?>

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StudentHub - Registration Errors</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f4f7fb;
                padding: 30px;
            }

            .box {
                max-width: 650