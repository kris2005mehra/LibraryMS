/*
  # Insert Sample Data

  1. Sample Books
    - Computer Science reference books
    - Mathematics textbooks
    - Electronics engineering books
    - Mechanical engineering books
    - Software engineering books

  2. Sample Users
    - Admin user
    - Librarian user
    - Sample students

  Note: This migration adds comprehensive sample data for testing
*/

-- Insert sample books
INSERT INTO books (isbn, title, author, category, publisher, year, stock, total_copies, description, image_url) VALUES
-- Computer Science Books
('978-0-262-03384-8', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 'Computer Science', 'MIT Press', 2022, 8, 12, 'The most comprehensive guide to algorithms, covering a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers. Essential reference for computer science students.', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-13-394803-8', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', 'Computer Science', 'McGraw-Hill', 2022, 6, 10, 'Comprehensive introduction to database systems covering design, implementation, and management. The definitive textbook for database courses with practical examples.', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-321-57351-3', 'Operating System Concepts', 'Abraham Silberschatz, Peter Baer Galvin, Greg Gagne', 'Computer Science', 'Wiley', 2021, 7, 11, 'The definitive guide to operating systems, covering process management, memory management, file systems, and distributed systems. Known as the "Dinosaur Book".', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-13-449505-3', 'Computer Networks', 'Andrew S. Tanenbaum, David J. Wetherall', 'Computer Science', 'Pearson', 2022, 5, 8, 'Comprehensive coverage of computer networking concepts, protocols, and technologies. The standard textbook for networking courses worldwide.', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Software Engineering Books
('978-0-13-449648-7', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Software Engineering', 'Prentice Hall', 2021, 9, 12, 'Essential guide to writing clean, maintainable code. A must-read for every software developer focusing on best practices and professional development.', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-201-61622-4', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Software Engineering', 'Addison-Wesley', 2020, 6, 9, 'Classic guide to becoming a better programmer through practical advice and timeless principles. Essential reading for software development professionals.', 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Mathematics Books
('978-0-07-352344-6', 'Higher Engineering Mathematics', 'B.S. Grewal', 'Mathematics', 'Khanna Publishers', 2023, 12, 18, 'Comprehensive textbook covering all aspects of engineering mathematics including calculus, linear algebra, differential equations, and complex analysis. Standard reference for engineering students.', 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-07-108735-6', 'Advanced Engineering Mathematics', 'Erwin Kreyszig', 'Mathematics', 'Wiley', 2022, 8, 12, 'Comprehensive coverage of mathematical methods for engineers and scientists. Includes differential equations, linear algebra, vector calculus, and complex analysis.', 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Electronics Books
('978-0-13-235088-4', 'Digital Signal Processing: Principles, Algorithms, and Applications', 'John G. Proakis, Dimitris G. Manolakis', 'Electronics', 'Pearson', 2022, 7, 10, 'Comprehensive coverage of digital signal processing fundamentals, algorithms, and applications with practical examples and MATLAB implementations.', 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-07-338066-7', 'Electronic Devices and Circuit Theory', 'Robert L. Boylestad, Louis Nashelsky', 'Electronics', 'Pearson', 2021, 9, 13, 'Comprehensive introduction to electronic devices and circuits. Covers diodes, transistors, amplifiers, and digital circuits with practical applications.', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Mechanical Engineering Books
('978-0-07-070271-5', 'Thermodynamics: An Engineering Approach', 'Yunus A. Cengel, Michael A. Boles', 'Mechanical Engineering', 'McGraw-Hill', 2023, 10, 15, 'Comprehensive introduction to thermodynamics with an engineering perspective, featuring real-world applications and problem-solving techniques.', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-07-339820-4', 'Fluid Mechanics', 'Frank M. White', 'Mechanical Engineering', 'McGraw-Hill', 2022, 8, 11, 'Comprehensive coverage of fluid mechanics principles with applications in engineering. Includes viscous flow, compressible flow, and turbomachinery.', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Additional Reference Books
('978-0-13-110362-7', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', 'Computer Science', 'Pearson', 2021, 5, 8, 'The leading textbook in Artificial Intelligence, covering intelligent agents, problem-solving, knowledge representation, planning, and machine learning.', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-07-352955-4', 'Engineering Mechanics: Statics', 'J.L. Meriam, L.G. Kraige', 'Mechanical Engineering', 'Wiley', 2022, 11, 16, 'Fundamental principles of engineering mechanics with emphasis on statics. Essential textbook for mechanical and civil engineering students.', 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400'),

('978-0-13-467179-8', 'Digital Design and Computer Architecture', 'David Harris, Sarah Harris', 'Electronics', 'Morgan Kaufmann', 2021, 6, 9, 'Modern approach to digital design and computer architecture, covering both hardware and software perspectives with practical examples.', 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400')

ON CONFLICT (isbn) DO NOTHING;