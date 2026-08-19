<?php
/**
 * Authentication Helper
 * Validates the API key for protected routes.
 */

function authenticate() {
    $envFile = __DIR__ . '/../.env';
    $validApiKey = null;
    
    // Load API key from environment
    if (file_exists($envFile)) {
        $env = parse_ini_file($envFile);
        $validApiKey = $env['API_KEY'] ?? null;
    } else {
        $validApiKey = getenv('API_KEY');
    }

    if (!$validApiKey) {
        // If server isn't configured securely, deny all writes
        http_response_code(500);
        echo json_encode(['message' => 'Server Configuration Error: API_KEY not set.']);
        exit;
    }

    // Get headers
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    // Check for Bearer token
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $providedKey = $matches[1];
        if (hash_equals($validApiKey, $providedKey)) {
            return true; // Authenticated
        }
    }

    // Unauthorized
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized. Invalid or missing API key.']);
    exit;
}
?>
