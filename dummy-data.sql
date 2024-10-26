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
        'National Aptitude Test (NAT)',
        'Test',
        'A comprehensive test assessing mathematical and analytical aptitude for nationwide admissions.',
        2.5,
        5,
        NOW(),
        NOW()
    ),
    (
        'NUST',
        'Universty',
        'Specialized preparation covering English and problem-solving for NUSTs competitive entry.',
        3.0,
        4,
        NOW(),
        NOW()
    ),
    (
        'Comsats',
        'Universty',
        'Focuses on core scientific principles tailored for Comsats University entry exams.',
        2.0,
        6,
        NOW(),
        NOW()
    ),
    (
        'Fast',
        'Universty',
        'Analytical and quantitative skills assessment designed for Fast University hopefuls.',
        2.0,
        6,
        NOW(),
        NOW()
    ),
    (
        'GCU',
        'Universty',
        'Prepares students with critical thinking and subject knowledge for GCUs entry requirements.',
        2.0,
        6,
        NOW(),
        NOW()
    ),
    (
        'PUCIT',
        'Universty',
        'Technical and analytical skill-building aimed at meeting PUCITs admission standards',
        2.0,
        6,
        NOW(),
        NOW()
    ),
    (
        'LUMS',
        'Universty',
        'Rigorous prep focusing on logical reasoning and quantitative skills for LUMS admissions.',
        5.0,
        3,
        NOW(),
        NOW()
    ),
    (
        'FCU',
        'Universty',
        'Covers essential concepts in sciences and reasoning for FCUs entrance exam.',
        2.0,
        5,
        NOW(),
        NOW()
    ),
    (
        'GIKI',
        'Universty',
        'Prepares candidates with foundational skills in mathematics and logic for GIKI entry.',
        4.0,
        3,
        NOW(),
        NOW()
    ),
    (
        'Kinnaird College ',
        'Univsersty',
        'hello Kinnaird College',
        2.5,
        5,
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
        'Verbal',
        'Verbal Ability or the English Language section is commonly a part of the various Government exams conducted in the country',
        NOW(),
        NOW()
    ),
    (
        'Quantitative',
        'It tests a candidates mathematical skills and analytical ability',
        NOW(),
        NOW()
    ),
    (
        'Analytical',
        'Boost analytical thinking with logic and pattern recognition',
        NOW(),
        NOW()
    ),
    (
        'Physics',
        'Understand fundamental physics concepts like mechanics and energy',
        NOW(),
        NOW()
    ),
    (
        'Chemistry',
        'Learn about atomic structure and chemical reactions',
        NOW(),
        NOW()
    ),
    (
        'Biology',
        'Explore cell biology, genetics, and ecological diversity',
        NOW(),
        NOW()
    ),
    (
        'Maths',
        'Strengthen skills in algebra, geometry, and calculus',
        NOW(),
        NOW()
    ),
    (
        'Subject Specific',
        'Focus on specialized knowledge in your field of study',
        NOW(),
        NOW()
    ),
    (
        'Computer',
        'Hi Computer',
        NOW(),
        NOW()
    ),
    (
        'Intellegence',
        'Intellegence',
        NOW(),
        NOW()
    ) -- Insert dummy data into TestTopics table
INSERT INTO
    "TestTopics" (test_id, topic_id, "createdAt", "updatedAt")
VALUES
    --NAT 
    (1, 1, NOW(), NOW()),
    (1, 2, NOW(), NOW()),
    (1, 3, NOW(), NOW()),
    (1, 4, NOW(), NOW()),
    (1, 5, NOW(), NOW()),
    (1, 6, NOW(), NOW()),
    (1, 7, NOW(), NOW()),
    -- Comsats
    (2, 1, NOW(), NOW()),
    (2, 4, NOW(), NOW()),
    (2, 7, NOW(), NOW()),
    (2, 9, NOW(), NOW()),
    (2, 10, NOW(), NOW()),
    -- Comsats
    (3, 1, NOW(), NOW()),
    (3, 2, NOW(), NOW()),
    (3, 3, NOW(), NOW()),
    (3, 4, NOW(), NOW()),
    (3, 5, NOW(), NOW()),
    (3, 6, NOW(), NOW()),
    (3, 7, NOW(), NOW()),
    -- FCU
    (8, 2, NOW(), NOW()),
    (8, 7, NOW(), NOW()),
    -- KC
    (10, 3, NOW(), NOW()),
    (10, 7, NOW(), NOW()),
    (10, 1, NOW(), NOW()),
    -- Insert dummy data into Drills table
INSERT INTO
    "Drills" (
        title,
        video,
        parent_drill_id,
        topic_id,
        "createdAt",
        "updatedAt"
    )
VALUES
(
        'Physics',
        'https://example.com/video1.mp4',
        ARRAY [] :: INTEGER [],
        8,
        NOW(),
        NOW()
    ),
    (
        'Chemistry',
        'https://example.com/video1.mp4',
        ARRAY [] :: INTEGER [],
        8,
        NOW(),
        NOW()
    ),
    (
        'Biology',
        'https://example.com/video1.mp4',
        ARRAY [] :: INTEGER [],
        8,
        NOW(),
        NOW()
    ),
    (
        'Maths',
        'https://example.com/video1.mp4',
        ARRAY [] :: INTEGER [],
        8,
        NOW(),
        NOW()
    ),
     (
        'Computer',
        'https://example.com/video1.mp4',
        ARRAY [] :: INTEGER [],
        8,
        NOW(),
        NOW()
    ),
    --  (
    --         'Maths',
    --         'https://example.com/video1.mp4',
    --         ARRAY [] :: INTEGER [],
    --         7,
    --         NOW(),
    --         NOW()
    --     ),
    --      (
    --         'Computer',
    --         'https://example.com/video1.mp4',
    --         ARRAY [] :: INTEGER [],
    --         9,
    --         NOW(),
    --         NOW()
    --     ),
    --      (
    --         'Intellegence',
    --         'https://example.com/video1.mp4',
    --         ARRAY [] :: INTEGER [],
    --         10,
    --         NOW(),
    --         NOW()
    --     )
    --  (
    --         'biology',
    --         'https://example.com/video1.mp4',
    --         ARRAY [] :: INTEGER [],
    --         6,
    --         NOW(),
    --         NOW()
    --     ),
    --  (
    --         'Chemistry',
    --         'https://example.com/video1.mp4',
    --         ARRAY [] :: INTEGER [],
    --         5,
    --         NOW(),
    --         NOW()
    --     ),
    --  (
    --         'Physics',
    --         'https://example.com/video1.mp4',
    --         ARRAY [] :: INTEGER [],
    --         4,
    --         NOW(),
    --         NOW()
    --     ),
    -- (
    --     'Statement Based',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     3,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Scenario Based',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     3,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Whole Numbers',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Decimal',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'PEMDS',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Fractions',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Square Root',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Percentage',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Proportions',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Problem Solving',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Ratios',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Combined Rates',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Algebra',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Geomatery',
    --     'https://example.com/video1.mp4',
    --     ARRAY [] :: INTEGER [],
    --     2,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Grammer',
    --     'https://example.com/video1.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- ),
    --  (
    --     'Synonyms',
    --     'https://example.com/video1.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Antonyms',
    --     'https://example.com/video2.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- ),
    --  (
    --     'Sentence Correction',
    --     'https://example.com/video2.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- ),
    --  (
    --     'Sentence Completion',
    --     'https://example.com/video2.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- ),
    -- (
    --     'Analogies',
    --     'https://example.com/video3.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- ),
    --  (
    --     'Comprehension',
    --     'https://example.com/video3.mp4',
    --     ARRAY[]::INTEGER[],
    --     1,
    --     NOW(),
    --     NOW()
    -- );
    -- Insert dummy data into Questions table

-- Insert dummy data into Questions table
INSERT INTO "Questions" (
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
    ('MCQs', NULL, 'There was a hint of carelessness about her appearance, as though the cut of her blouse or the fit of her slacks was a matter of—----------- to her.', NULL, 
    '{"A": "satisfaction", "B": "Aesthetics", "C": "indifference", "D": "Significance", "E": "Controversy"}'::JSON, 
    'C', 1, NOW(), NOW()),

    ('MCQs', NULL, 'Many educators argue that a —---------- grouping of students would improve instruction because it would limit the range of student abilities in the classroom.', NULL, 
    '{"A": "heterogeneous", "B": "Systematic", "C": "homogeneous", "D": "Sporadic", "E": "Fragmentary"}'::JSON, 
    'C', 1, NOW(), NOW()),

    ('MCQs', NULL, 'He bought a three —-------- suits.', NULL, 
    '{"A": "Hundred-dollars", "B": "Hundred-dollar", "C": "Hundreds-dollar", "D": "Hundreds-dollars"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'She liked her student’s—------------- for her class.', NULL, 
    '{"A": "To arrive prompt", "B": "To arrive promptly", "C": "To arrive prompt", "D": "To arrive prompt"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'In this the bus—-------------- goes to sadar bazar.', NULL, 
    '{"A": "That", "B": "Which", "C": "Who", "D": "To arrive prompt"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'Take your air conditioner back to —------------sold it to you.', NULL, 
    '{"A": "Man who", "B": "Man that", "C": "Man whom", "D": "Man which"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'Where can one find the leather shop—----------------- sells school bags at price?', NULL, 
    '{"A": "Which", "B": "That", "C": "Who", "D": "Whom"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'As news of his indictment spread through the town, the citizens began to —--------him and to avoid meeting him.', NULL, 
    '{"A": "ostracize", "B": "Congratulate", "C": "desecrate", "D": "Minimize", "E": "Harass"}'::JSON, 
    'A', 1, NOW(), NOW()),

    ('MCQs', NULL, 'That overhead projector—----------- thousand rupees.', NULL, 
    '{"A": "Nearly cost sixty", "B": "Cost sixty nearly", "C": "Cost nearly sixty", "D": "Cost sixty nearly"}'::JSON, 
    'C', 1, NOW(), NOW()),

    ('MCQs', NULL, 'The lady in the dining room is a —-----------------woman.', NULL, 
    '{"A": "Extremely pleasant", "B": "Extreme pleasantly", "C": "Extreme pleasant", "D": "Pleasant extremely"}'::JSON, 
    'A', 1, NOW(), NOW()),

    ('MCQs', NULL, 'He looks —---------------------.', NULL, 
    '{"A": "In black handsomely", "B": "Handsomely in black", "C": "Handsome in black", "D": "Black handsomely"}'::JSON, 
    'C', 1, NOW(), NOW()),

    ('MCQs', NULL, 'The songs of new age sound —---------------me.', NULL, 
    '{"A": "Badly to", "B": "Badly", "C": "Bad", "D": "Bad to"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'He appeared —------------------began to take the exam.', NULL, 
    '{"A": "Nervous as he", "B": "Nervously when he", "C": "Nervously as he", "D": "None"}'::JSON, 
    'B', 1, NOW(), NOW()),

    ('MCQs', NULL, 'There was a surprising story in the paper about the —---------car was stolen.', NULL, 
    '{"A": "man which his", "B": "man whose his", "C": "man that his", "D": "man whose"}'::JSON, 
    'D', 1, NOW(), NOW()),

    ('MCQs', NULL, 'Several times during the session the director—-------- to tell his success story to other promotion officers.', NULL, 
    '{"A": "Asked he", "B": "Asked who", "C": "Asked him", "D": "Asked his"}'::JSON, 
    'C', 1, NOW(), NOW()),

    ('MCQs', NULL, 'When one needs career counseling,---------------- go to the college career advisor.', NULL, 
    '{"A": "You should", "B": "It should", "C": "He should", "D": "One should"}'::JSON, 
    'D', 1, NOW(), NOW()),

    ('MCQs', NULL, 'Did anybody do the work—--------------- ?', NULL, 
    '{"A": "Themselves", "B": "Him selves", "C": "His self", "D": "None"}'::JSON, 
    'A', 1, NOW(), NOW()),

    ('MCQs', NULL, 'Take your application to the—------------- you think can help you.', NULL, 
    '{"A": "Person whom", "B": "Person", "C": "Person who", "D": "Person which"}'::JSON, 
    'C', 1, NOW(), NOW());


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