<?php
class Database
{
    // Database Credentials
    private $host = 'localhost';
    private $db_name = 'portfolio_db';
    private $username = 'root'; // Change to your MySQL username
    private $password = ''; // Change to your MySQL password
    private $conn;

    /**
     * Get the database connection.
     * @return PDO|null The PDO connection object or null on failure.
     */
    public function connect()
    {
        $this->conn = null;

        // Check if running on localhost
        if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1') {
            $this->host = 'localhost';
            $this->db_name = 'portfolio_db';
            $this->username = 'root';
            $this->password = '';
        } else {
            // InfinityFree credentials
            $this->host = 'sql102.infinityfree.com';
            $this->db_name = 'if0_40862933_portfoli0';
            $this->username = 'if0_40862933';
            $this->password = 'daIDn4ONzG';
        }

        try {
            $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Return JSON error response for API clients
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array('message' => 'Connection Error: ' . $e->getMessage()));
            exit;
        }

        return $this->conn;
    }
}