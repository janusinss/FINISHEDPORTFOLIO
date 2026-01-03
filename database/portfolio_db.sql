CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;
CREATE TABLE profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    professional_title VARCHAR(150) NOT NULL,
    bio TEXT,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    facebook_url VARCHAR(255),
    profile_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO profile (
        full_name,
        professional_title,
        bio,
        email,
        phone,
        facebook_url,
        profile_photo_url
    )
VALUES (
        'Janus Dominic',
        'Full-Stack Developer & Software Engineer',
        'Passionate developer with expertise in building modern web applications. Specializing in PHP, MySQL, JavaScript, and creating seamless user experiences.',
        'janusdominic0@gmail.com',
        '+63 994 873 9200',
        'https://www.facebook.com/notagirlgamer69',
        'https://i.pravatar.cc/400?img=33'
    );
CREATE TABLE skill_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO skill_categories (name, description)
VALUES (
        'Programming Languages',
        'Core programming and scripting languages'
    ),
    (
        'Web Development',
        'Frontend and backend web technologies'
    ),
    ('Database', 'Database management systems'),
    (
        'Tools & Frameworks',
        'Development tools and frameworks'
    ),
    (
        'Soft Skills',
        'Non-technical professional skills'
    );
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE
    SET NULL,
        INDEX idx_category (category_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO skills (name, category_id)
VALUES ('PHP', 1),
    ('JavaScript', 1),
    ('Python', 1),
    ('HTML5/CSS3', 2),
    ('React', 2),
    ('Tailwind CSS', 2),
    ('MySQL', 3),
    ('PostgreSQL', 3),
    ('Git & GitHub', 4),
    ('VS Code', 4),
    ('Problem Solving', 5),
    ('Team Collaboration', 5);
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    project_url VARCHAR(255),
    repo_url VARCHAR(255),
    image_url VARCHAR(255),
    project_date DATE,
    status ENUM(
        'planning',
        'in-progress',
        'completed',
        'archived'
    ) DEFAULT 'completed',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_date (project_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO projects (
        title,
        description,
        project_url,
        repo_url,
        image_url,
        project_date,
        status,
        featured
    )
VALUES (
        'SayLess Company Website',
        'A professional website for a tech company called "SayLess" that specializes in building digital experiences, such as premium websites and applications. It features a portfolio of their work (including a Research Ethics Office portal), a list of team members (with Janus Dominic as Project Manager), and a blog with industry insights.',
        'https://sayless.click/',
        'https://github.com/janusinss/sayless',
        'https://placehold.co/600x400/4338ca/FFF?text=SayLess+Corp',
        '2024-03-15',
        'completed',
        TRUE
    ),
    (
        'FreshCart Grocery Website',
        'An online market platform named "FreshCart Market" designed to sell organic and fresh groceries. It allows users to browse various categories like fruits, vegetables, and pantry items, add them to a cart, and "checkout." The footer indicates it is a student project by Janus Dominic.',
        'https://janus-grocery.ct.ws/',
        'https://github.com/janusinss/freshcart',
        'https://placehold.co/600x400/0891b2/FFF?text=Grocery+App',
        '2024-01-20',
        'completed',
        TRUE
    ),
    (
        'Fitness Gym (Old Project)',
        'A promotional landing page for a local gym ("Fitness Gym"). It outlines the gyms offerings, including basic equipment (cardio, weights), training guides (moderate to expert levels), and opportunities to become a trainer',
        'https://dominic-lab09.netlify.app/#',
        'https://github.com/janusinss/fitness-gym',
        'https://placehold.co/600x400/16a34a/FFF?text=Fitness+Gym',
        '2023-11-10',
        'completed',
        FALSE
    );
CREATE TABLE project_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id),
    INDEX idx_project (project_id),
    INDEX idx_skill (skill_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO project_skills (project_id, skill_id)
VALUES (1, 1),
    (1, 4),
    (1, 7),
    (2, 1),
    (2, 4),
    (2, 7),
    (3, 2),
    (3, 4),
    (3, 6);
CREATE TABLE hobbies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO hobbies (name, description)
VALUES ('Gaming', 'Playing strategy and RPG games'),
    (
        'Creating Websites',
        'Building experimental applications'
    ),
    (
        'Reading Tech Blogs',
        'Staying updated with latest technology trends'
    ),
    (
        'Coding Side Projects',
        'Building experimental applications'
    ),
    ('Instrumental Music', 'Playing the Guitar');
CREATE TABLE education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150),
    start_date DATE NOT NULL,
    end_date DATE,
    grade VARCHAR(20),
    description TEXT,
    location VARCHAR(100),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_start_date (start_date),
    INDEX idx_is_current (is_current)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO education (
        institution,
        degree,
        field_of_study,
        start_date,
        end_date,
        grade,
        description,
        location,
        is_current
    )
VALUES (
        'Western Mindanao State University',
        'Bachelor of Science in Computer Science',
        'Computer Science',
        '2019-08-01',
        '2023-06-15',
        '3.8 GPA',
        'Focused on software engineering, database systems, and web development. Dean''s Lister for 4 consecutive semesters.',
        'Diliman, Quezon City',
        FALSE
    ),
    (
        'Zamboanga National High School West',
        'High School Diploma',
        'STEM Track',
        '2015-06-01',
        '2019-04-01',
        'With Honors',
        'Specialized in Science, Technology, Engineering, and Mathematics.',
        'Pasig City',
        FALSE
    );
CREATE TABLE certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(100),
    credential_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_issue_date (issue_date),
    INDEX idx_expiry_date (expiry_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO certifications (
        title,
        issuing_organization,
        issue_date,
        expiry_date,
        credential_id,
        credential_url,
        description
    )
VALUES (
        'Legacy Responsive Web Design V8',
        'FreeCodeCamp',
        '2024-02-15',
        '2027-02-15',
        'AWS-DEV-2024-12345',
        'https://aws.amazon.com/verification/12345',
        'Validates expertise in developing and maintaining AWS-based applications'
    ),
    (
        'School Internship',
        'Western Mindanao State University',
        '2023-09-20',
        NULL,
        'MYSQL-DBA-67890',
        'https://oracle.com/cert/67890',
        'Professional certification for MySQL database administration'
    );
CREATE TABLE experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    employment_type ENUM(
        'full-time',
        'part-time',
        'contract',
        'internship',
        'freelance'
    ) DEFAULT 'full-time',
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_start_date (start_date),
    INDEX idx_is_current (is_current)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO experience (
        company,
        position,
        employment_type,
        location,
        start_date,
        end_date,
        is_current,
        description
    )
VALUES (
        'Western Mindanao State University',
        'Junior Full-Stack Developer',
        'full-time',
        'Makati City, Metro Manila',
        '2023-07-01',
        NULL,
        TRUE,
        'Developing and maintaining web applications using PHP, MySQL, and React. Collaborating with cross-functional teams to deliver high-quality software solutions.'
    ),
    (
        'Western Mindanao State University',
        'Web Development Intern',
        'internship',
        'Pasig City, Metro Manila',
        '2023-01-15',
        '2023-06-30',
        FALSE,
        'Assisted in building responsive websites and learned industry best practices. Worked on 5+ client projects during the internship period.'
    );
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    category ENUM(
        'award',
        'recognition',
        'competition',
        'publication',
        'other'
    ) DEFAULT 'other',
    description TEXT,
    date_achieved DATE NOT NULL,
    issuing_organization VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_date (date_achieved)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
INSERT INTO achievements (
        title,
        category,
        description,
        date_achieved,
        issuing_organization
    )
VALUES (
        'FreeCodeCamp Responsive Web Design',
        'award',
        'Recognized for outstanding capstone project in Computer Science with innovative approach to solving real-world problems.',
        '2023-06-01',
        'FreeCodeCamp'
    ),
    (
        'Software Engineering 1',
        'competition',
        '1st Place in 48-hour hackathon for developing a smart parking solution using IoT and web technologies.',
        '2023-03-15',
        'Western Mindanao State University'
    ),
    (
        'ACT Internship',
        'recognition',
        'Recognized for significant contributions to open-source PHP projects on GitHub.',
        '2024-01-20',
        'ACT'
    );
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP NULL,
    INDEX idx_received (received_at),
    INDEX idx_is_read (is_read)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
SHOW TABLES;
SELECT 'profile' as table_name,
    COUNT(*) as record_count
FROM profile
UNION ALL
SELECT 'skill_categories',
    COUNT(*)
FROM skill_categories
UNION ALL
SELECT 'skills',
    COUNT(*)
FROM skills
UNION ALL
SELECT 'projects',
    COUNT(*)
FROM projects
UNION ALL
SELECT 'project_skills',
    COUNT(*)
FROM project_skills
UNION ALL
SELECT 'hobbies',
    COUNT(*)
FROM hobbies
UNION ALL
SELECT 'education',
    COUNT(*)
FROM education
UNION ALL
SELECT 'certifications',
    COUNT(*)
FROM certifications
UNION ALL
SELECT 'experience',
    COUNT(*)
FROM experience
UNION ALL
SELECT 'achievements',
    COUNT(*)
FROM achievements;