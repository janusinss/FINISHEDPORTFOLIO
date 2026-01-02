<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../database.php';
include_once '../Hobby.php';

$database = new Database();
$db = $database->connect();
$hobby = new Hobby($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get all hobbies
    $result = $hobby->read();
    $num = $result->rowCount();

    if ($num > 0) {
        $hobbies_arr = array();
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $hobby_item = array(
                'id' => $id,
                'name' => $name,
                'description' => $description ?? ''
            );
            array_push($hobbies_arr, $hobby_item);
        }
        http_response_code(200);
        echo json_encode($hobbies_arr);
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
            $hobby->name = $data->name;
            $hobby->description = $data->description;

            if ($hobby->add()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Hobby Added', 'id' => $hobby->id));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Hobby Not Added'));
            }
            break;

        case 'update':
            $hobby->id = $data->id;
            $hobby->name = $data->name;
            $hobby->description = $data->description;

            if ($hobby->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Hobby Updated'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Hobby Not Updated'));
            }
            break;

        case 'delete':
            $hobby->id = $data->id;

            if ($hobby->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Hobby Deleted'));
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Hobby Not Deleted'));
            }
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