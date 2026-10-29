<?php
// Practical 7 - View Stored Registrations

$csvFile = __DIR__ . "/../data/registrations.csv";

$students = [];
$error = "";

// Check whether the CSV file exists
if (file_exists($csvFile)) {

    $file = fopen($csvFile, "r");

    if ($file !== false) {

        // Read the CSV header
        $header = fgetcsv($file);

        // Read student records
        while (($row = fgetcsv($file)) !== false) {

            if (count($row) >= 7) {
                $students[] = $row;
            }
        }

        fclose($file);

    } else {
        $error = "Unable to open the registration file.";
    }

} else {
    $error = "No registration records found. Please register a student first.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>StudentHub - Registered Students</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background: #f4f7fb;
            color: #222;
        }

        h1 {
            text-align: center;
            color: #174ea6;
        }

        .message {
            text-align: center;
            padding: 15px;
            margin: 20px 0;
            background: #fff;
            border-radius: 8px;
        }

        .table-container {
            overflow-x: auto;
            background: white;
            border-radius: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        th {
            background: #174ea6;
            color: white;
        }

        tr:nth-child(even) {
            background: #f2f6fc;
        }

        .back {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 18px;
            background: #174ea6;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>

    <h1>Registered Students</h1>

    <div class="message">
        Total Registered Students: <strong><?= count($students) ?></strong>
    </div>

    <?php if ($error !== ""): ?>

        <p><?= htmlspecialchars($error, ENT_QUOTES, "UTF-8") ?></p>

    <?php elseif (count($students) === 0): ?>

        <p>No student records are available yet.</p>

    <?php else: ?>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Gender</th>
                    </tr>
                </thead>

                <tbody>
                    <?php foreach ($students as $row): ?>
                        <tr>
                            <td><?= htmlspecialchars($row[0], ENT_QUOTES, "UTF-8") ?></td>
                            <td><?= htmlspecialchars($row[1], ENT_QUOTES, "UTF-8") ?></td>
                            <td><?= htmlspecialchars($row[2], ENT_QUOTES, "UTF-8") ?></td>
                            <td><?= htmlspecialchars($row[4], ENT_QUOTES, "UTF-8") ?></td>
                            <td><?= htmlspecialchars($row[5], ENT_QUOTES, "UTF-8") ?></td>
                            <td><?= htmlspecialchars($row[6], ENT_QUOTES, "UTF-8") ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

    <?php endif; ?>

    <a class="back" href="../pages/register.html">Back to Registration</a>

</body>
</html>