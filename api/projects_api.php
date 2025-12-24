<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../database.php';
include_once '../Project.php';

$database = new Database();
$db = $database->connect();
$project = new Project($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get all projects
    $result = $project->read();
    $num = $result->rowCount();

    if ($num > 0) {
        $projects_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $project_item = array(
                'id' => $id,
                'title' => $title,
                'description' => $description,
                'project_url' => $project_url ?? '#',
                'repo_url' => $repo_url ?? '#',
                'project_date' => $project_date ?? '',
                'image_url' => $image_url ?? 'https://placehold.co/600x400/555/FFF?text=Project'
            );
            array_push($projects_arr, $project_item);
        }
        http_response_code(200);
        echo json_encode($projects_arr);
    } else {
        http_response_code(200);
        echo json_encode(array());
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->action)) {
        http_response_code(400);
        echo json_encode(array('message' => 'Action parameter is required.'));
        exit;
    }

    switch ($data->action) {
        case 'add':
            // ... Add Logic ...
            http_response_code(501);
            echo json_encode(array('message' => 'Add Not Implemented'));
            break;

        case 'update':
            $project->id = $data->id;
            $project->title = $data->title;
            $project->description = $data->description;
            // Handle optional fields or default them logic if needed, 
            // but Project.php expects them. Ideally we pass current values if not modified.
            $project->project_url = $data->project_url ?? '#';
            $project->repo_url = $data->repo_url ?? '#';
            $project->project_date = $data->project_date ?? date('Y-m-d');
            $project->image_url = $data->image_url ?? '';

            if ($project->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Project Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Project Not Updated'));
            }
            break;

        case 'delete':
            // ... Delete Logic (Future) ...
            http_response_code(501);
            echo json_encode(array('message' => 'Delete Not Implemented'));
            break;

        default:
            http_response_code(400);
            echo json_encode(array('message' => 'Invalid action.'));
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Method Not Allowed'));
}
?>