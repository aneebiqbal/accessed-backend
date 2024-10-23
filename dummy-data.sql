-- Insert dummy data into Tests table
INSERT INTO
    "Tests" (
        title,
        type,
        description,
        est_hours,
        no_lessons,
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        'Math Test',
        'Multiple Choice',
        'Basic arithmetic and algebra',
        2.5,
        5,
        NOW(),
        NOW()
    ),
    (
        'English Test',
        'Essay',
        'Grammar and comprehension',
        3.0,
        4,
        NOW(),
        NOW()
    ),
    (
        'Science Test',
        'Mixed',
        'Biology and chemistry basics',
        2.0,
        6,
        NOW(),
        NOW()
    );

-- Insert dummy data into Students table
INSERT INTO
    "Students" (
        first_name,
        last_name,
        email,
        number,
        password,
        test_id,
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        'password123',
        4,
        NOW(),
        NOW()
    ),
    (
        'Jane',
        'Smith',
        'jane.smith@example.com',
        '0987654321',
        'password456',
        5,
        NOW(),
        NOW()
    ),
    (
        'Bob',
        'Johnson',
        'bob.johnson@example.com',
        '1122334455',
        'password789',
        6,
        NOW(),
        NOW()
    );

-- Insert dummy data into Topics table
INSERT INTO
    "Topics" (title, description, "createdAt", "updatedAt")
VALUES
    (
        'Algebra',
        'Basic algebraic concepts',
        NOW(),
        NOW()
    ),
    ('Grammar', 'English grammar rules', NOW(), NOW()),
    (
        'Biology',
        'Introduction to biology',
        NOW(),
        NOW()
    );

-- Insert dummy data into TestTopics table
INSERT INTO
    "TestTopics" (test_id, topic_id, "createdAt", "updatedAt")
VALUES
    (1, 1, NOW(), NOW()),
    (2, 2, NOW(), NOW()),
    (3, 3, NOW(), NOW());

-- Insert dummy data into Drills table
INSERT INTO
    "Drills" (title, video, topic_id, "createdAt", "updatedAt")
VALUES
    (
        'Solving Equations',
        'https://example.com/video1.mp4',
        1,
        NOW(),
        NOW()
    ),
    (
        'Sentence Structure',
        'https://example.com/video2.mp4',
        2,
        NOW(),
        NOW()
    ),
    (
        'Cell Biology',
        'https://example.com/video3.mp4',
        3,
        NOW(),
        NOW()
    );

-- Insert dummy data into Questions table
INSERT INTO
    "Questions" (
        "questionType",
        passage,
        statement,
        image,
        options,
        correct_answer,
        drill_id,
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        'image',
        NULL,
        'What is this image showing?',
        'https://example.com/image1.jpg',
        '{"A": "Cell", "B": "Atom", "C": "Molecule"}',
        'B',
        3,
        NOW(),
        NOW()
    ),
    (
        'passage',
        'The quick brown fox jumps over the lazy dog.',
        'What color is the fox?',
        NULL,
        '{"A": "Red", "B": "Brown", "C": "Gray"}',
        'B',
        2,
        NOW(),
        NOW()
    ),
    (
        'MCQs',
        NULL,
        'Solve for x: 2x + 5 = 13',
        NULL,
        '{"A": "3", "B": "4", "C": "5"}',
        'B',
        1,
        NOW(),
        NOW()
    );


-- Insert dummy data into DrillStatus table
INSERT INTO
    "DrillStatuses" (
        drill_id,
        student_id,
        status,
        "createdAt",
        "updatedAt"
    )
VALUES
    (1, 1, 'Completed', NOW(), NOW()),
    (2, 1, 'inProgress', NOW(), NOW()),
    (3, 2, 'Blocked', NOW(), NOW());

-- Insert dummy data into DrillLevels table
INSERT INTO
    "DrillLevels" (
        drill_id,
        levels,
        status,
        score,
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        1,
        '{"level1": true, "level2": false, "level3": false}',
        'inProgress',
        0.7,
        NOW(),
        NOW()
    ),
    (
        2,
        '{"level1": true, "level2": true, "level3": false}',
        'Completed',
        0.9,
        NOW(),
        NOW()
    ),
    (
        3,
        '{"level1": false, "level2": false, "level3": false}',
        'Blocked',
        0.0,
        NOW(),
        NOW()
    );

-- Insert dummy data into QuestionStatus table
INSERT INTO
    "QuestionStatuses" (
        question_id,
        student_id,
        attempted_answer,
        "createdAt",
        "updatedAt"
    )
VALUES
    (1, 1, 'B', NOW(), NOW()),
    (2, 2, 'A', NOW(), NOW()),
    (3, 3, 'C', NOW(), NOW());