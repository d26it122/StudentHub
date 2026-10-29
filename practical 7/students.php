
<?php
$file = __DIR__ . "/data/registrations.csv";
$students = [];
$error = "";

if (file_exists($file) && is_readable($file)) {
    if (($handle = fopen($file, "r")) !== false) {
        // The first CSV row contains column headings.
        $headers = fgetcsv($handle);
        if ($headers !== false) {
            while (($row = fgetcsv($handle)) !== false) {
                if (count(array_filter($row, fn($value) => trim((string)$value) !== "")) === 0) {
                    continue;
                }
                // Pad short rows so missing values do not cause undefined-index notices.
                $students[] = array_pad($row, count($headers), "");
            }
        }
        fclose($handle);
    } else {
        $error = "Unable to read the registration file.";
    }
} else {
    // A missing CSV simply means no one has registered yet.
    $headers = ["Full Name", "Email", "Roll Number", "Mobile", "Course", "Semester", "Gender", "Registered At", "Password Hash"];
}

// Never display the password hash in the public registered-students table.
$visibleColumns = [0, 1, 2, 3, 4, 5, 6, 7];
$visibleHeaders = array_map(fn($index) => $headers[$index] ?? "", $visibleColumns);
function e($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES, "UTF-8");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Students | StudentHub</title>
    <style>
        * { box-sizing: border-box; }

        body {
            margin: 0;
            padding: 30px 16px;
            font-family: Arial, sans-serif;
            background: #f1f5f9;
            color: #1e293b;
        }

        .container {
            max-width: 1200px;
            margin: auto;
            padding: 25px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 18px #00000012;
        }

        h1 { color: #174ea6; margin-top: 0; }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 16px;
            border-radius: 6px;
            background: #174ea6;
            color: white;
            text-decoration: none;
        }

        .table-wrap { overflow-x: auto; }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            padding: 12px;
            border: 1px solid #dbe3ef;
            text-align: left;
            white-space: nowrap;
        }

        th { background: #174ea6; color: white; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        .message { padding: 14px; background: #eff6ff; border-radius: 6px; }
        .count { color: #475569; }
    </style>
</head>
<body>
<div class="container">
    <div class="topbar">
        <div>
            <h1>Registered Students</h1>
            <p class="count">
                Total records: <?php echo count($students); ?>
            </p>
            <?php if (isset($_GET["registered"])): ?>
                <p class="message">Registration saved successfully.</p>
            <?php endif; ?>
        </div>
        <a class="btn" href="register.html">Register New Student</a>
    </div>

    <?php if ($error !== ""): ?>
        <p class="message"><?php echo e($error); ?></p>
    <?php elseif (count($students) === 0): ?>
        <p class="message">
            No registered students found. Please register a student first.
        </p>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <?php foreach ($visibleHeaders as $heading): ?>
                            <th><?php echo e($heading); ?></th>
                        <?php endforeach; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($students as $student): ?>
                        <tr>
                            <?php foreach ($visibleColumns as $index): ?>
                                <td><?php echo e($student[$index] ?? ""); ?></td>
                            <?php endforeach; ?>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
