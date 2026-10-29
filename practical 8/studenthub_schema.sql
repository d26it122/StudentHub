-- StudentHub Practical 8/9 database schema
-- Import this file using phpMyAdmin > Import.
CREATE DATABASE IF NOT EXISTS studenthub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studenthub;

CREATE TABLE IF NOT EXISTS courses (
    course_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO courses (course_id, course_name) VALUES
(1, 'Information Technology'),
(2, 'Computer Science'),
(3, 'Computer Engineering');

CREATE TABLE IF NOT EXISTS students (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    course_id INT NULL,
    year INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_course FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
    event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    category VARCHAR(60) NOT NULL,
    description TEXT NULL
) ENGINE=InnoDB;

INSERT INTO events (title, event_date, location, category, description)
SELECT * FROM (
    SELECT 'Tech Fest 2026', '2026-11-20', 'Main Auditorium', 'Technical', 'College technology festival.' UNION ALL
    SELECT 'Coding Competition', '2026-11-22', 'Computer Lab 1', 'Technical', 'Show your programming skills.' UNION ALL
    SELECT 'Web Development Workshop', '2026-11-25', 'Seminar Hall', 'Workshop', 'Learn modern web development.' UNION ALL
    SELECT 'Sports Festival', '2026-11-28', 'University Ground', 'Sports', 'College sports activities.' UNION ALL
    SELECT 'AI and Machine Learning Seminar', '2026-12-02', 'Seminar Hall', 'Technical', 'Introduction to AI and machine learning.'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM events WHERE events.title = seed.title);

CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_event (student_id, event_id),
    CONSTRAINT fk_registrations_student FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(event_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
