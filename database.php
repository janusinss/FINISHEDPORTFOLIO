<?php
class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    /**
     * Get the database connection.
     * @return PDO|null The PDO connection object or null on failure.
     */
    public function connect()
    {
        $this->conn = null;

        // Load .env variables if file exists
        $envFile = __DIR__ . '/.env';
        if (file_exists($envFile)) {
            $env = parse_ini_file($envFile);
            $this->host = $env['DB_HOST'] ?? 'localhost';
            $this->db_name = $env['DB_NAME'] ?? 'portfolio_db';
            $this->username = $env['DB_USER'] ?? 'root';
            $this->password = $env['DB_PASS'] ?? '';
        } else {
            // Fallback for environments where .env isn't used or vars are set by the server
            $this->host = getenv('DB_HOST') ?: 'localhost';
            $this->db_name = getenv('DB_NAME') ?: 'portfolio_db';
            $this->username = getenv('DB_USER') ?: 'root';
            $this->password = getenv('DB_PASS') ?: '';
        }

        try {
            $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Log the actual error safely
            error_log('Database Connection Error: ' . $e->getMessage());
            
            // Return a generic JSON error response for API clients
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array('message' => 'Database connection failed.'));
            exit;
        }

        return $this->conn;
    }
}