<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (!isset($_SESSION['csrf_token']) || empty($_SESSION['csrf_token'])) {
		echo json_encode('CSRF token issue!');die();
	}
	$_POST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);
	if (isset($_POST['cmd']) && !empty($_POST['cmd'])) {
		$cmd = $_POST['cmd'];
		$cmd();
	}
	else {
		$data['status'] = false;
		$data['response'] = 'Command not found!';

		echo json_encode($data);die();	
	}
}
else if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["req"]) && $_GET["req"] == 'node') {
	require_once('db.php');
	$sql = "SELECT * FROM `wallet`";
	$query = mysqli_query($conn, $sql);
	$rows = mysqli_affected_rows($conn);
	if ($rows > 0) {
		$row = mysqli_fetch_assoc($query);
		$data['data'] = 'true';
		$data['sd'] = $row['seed'];
		echo json_encode($data);
	}
	else {
		$data['status'] = 'false';
		echo json_encode($data);
	}
}
else {
	$data['status'] = false;
	$data['response'] = 'Invalid Request Method!';
	echo json_encode($data);die();
}
function secured_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}


function fetch_leaderboard() {
	require_once('db.php');

	$sql = "SELECT * FROM `leaderboard` WHERE `status` != 'playing' ORDER BY `id` DESC LIMIT 10";
	$query = mysqli_query($conn, $sql);
	$rows = mysqli_affected_rows($conn);
	$table_html = '';
	$current_datetime = date('Y-m-d h:i:s');
	if ($rows > 0) {
		while($row = mysqli_fetch_assoc($query)) {
			$start_date = new DateTime($current_datetime);
			$since_start = $start_date->diff(new DateTime($row["gametime"]));

			if($since_start->d !== 0) {
				$time = $since_start->d.' days ago';
			}
			else if($since_start->h !== 0) {
				$time = $since_start->h .' hours ago';
			}
			else if($since_start->i !== 0) {
				$time = $since_start->i .' minutes ago';
			}
			else {
				$time = $since_start->i .' seconds ago';
			}

			$table_html .= '<tr><td>'.substr($row["player_address"], 0, 8).'</td><td>'.$row["bet_amount"].'</td><td>'.$row["status"].'</td><td>'.$time.'</td></tr>';

		}
		echo $table_html;
	}
	else {
		$table_html = '<tr colspan="4"><td class="text-center">No History found!</td></tr>';
		echo $table_html;
	}
}

function fetch_wallet() {
	if (!isset($_POST['csrf']) || empty($_POST['csrf']) || $_POST['csrf'] !== $_SESSION['csrf_token']) {
		echo json_decode('CSRF token not mathched!');die();
	}
	require_once('db.php');

	$sql = "SELECT * FROM `wallet`";
	$query = mysqli_query($conn, $sql);
	$rows = mysqli_affected_rows($conn);
	if ($rows > 0) {
		$row = mysqli_fetch_assoc($query);
		$data['data'] = 'true';
		$data['pubkey'] = $row['public_key'];
		echo json_encode($data);
	}
	else {
		$data['status'] = 'false';
		echo json_encode($data);
		
	}
}
function save_game() {
	require_once('db.php');
	$player_address = secured_input($_POST['player_address']);
	$bet_amount = secured_input($_POST['bet_amount']);
	$status = 'playing';

	$sql = "INSERT INTO `leaderboard`(`player_address`, `bet_amount`, `status`) VALUES ('{$player_address}','{$bet_amount}','{$status}')";
	$query = mysqli_query($conn, $sql);
	$result = mysqli_affected_rows($conn);
	$id = $conn->insert_id;
	if ($result == 1) {
		$data['status'] = 'true';
		$data['response'] = $id;
		echo json_encode($data);
	}
	else {
		$data['status'] = 'false';
		$data['response'] = 'Could not save the game data!';
		echo json_encode($data);
	}
}
function update_game() {
	require_once('db.php');
	$id = secured_input($_POST['id']);
	$status = secured_input($_POST['status']);

	$sql = "UPDATE `leaderboard` SET `status`='{$status}' WHERE `id`='{$id}'";
	$query = mysqli_query($conn, $sql);
	$result = mysqli_affected_rows($conn);

	if ($result >= 1) {
		$data['status'] = 'true';
		$data['response'] = 'Game data is updated';
		echo json_encode($data);
	}
	else {
		$data['status'] = 'false';
		$data['response'] = 'Could not updated the game data!';
		echo json_encode($data);
	}
}
?>