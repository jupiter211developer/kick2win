<?php 
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}
if (!isset($_SESSION['csrf_token']) || empty($_SESSION['csrf_token'])) {
	$_SESSION['csrf_token'] = md5(rand(1111111,999999999));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="icon" href="assets/img/kick2win.png">
	<link rel="shortcut icon" href="assets/img/kick2win.png">
	<!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
	<title>EARN Mode | Football Game</title>
	<link rel="stylesheet" type="text/css" href="styles/index.css">
	<link rel="stylesheet" type="text/css" href="assets/bootstrap-4.4.1-dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/fontawesome-free-5.13.0-web/css/all.min.css">
	<link rel="stylesheet" type="text/css" href="styles/snackbar.css">
</head>
<body>
	<div id="snackbar"></div>
	<audio id="cheers">
		<source src="sounds/cheers.wav" type="audio/wav">
	</audio>
	<audio id="upset">
		<source src="sounds/upset.mp3" type="audio/mp3">
	</audio>
	<canvas id="canvas"></canvas>
	<div id="data">
		<input type="hidden" id="direction" value="">
		<input type="hidden" id="betAmount" value="">
		<input type="hidden" id="walletAddress">
		<input type="hidden" id="gid">
		<input type="hidden" id="csrf_token">
	</div>
	<div class="row">
		<div class="col-md-9">
			<img src="assets/img/kick2win.png" style="width: 35%;height: 65%;">
		</div>
		<div class="col-md-3">
			<img src="assets/img/solana-full.png" class="mt-5" style="width: 90%;height: 15%;"><br>
			<table class="table table-dark table-bordered mt-2 bg-dark col-md-7">
				<thead>
					<th>Balance <span class="fa fa-coins"></span></th>
					<th><span id="currentBalance">0</span> SOL</th>
				</thead>
			</table>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-md-12 fixed-top mt-3" align="center">
				<span class="col-md-2 badge badge-warning">Earn Mode</span>
				<br>
				<span class="col-md-1 badge badge-danger" onclick="window.location='index.php'">Back</span>
			</div>
			<div class="col-md-12 fixed-bottom mb-5" align="center">
				<button class="btn btn-sm btn-light mb-2 btnSol" value="0.1">0.1 SOL</button>
				<button class="btn btn-sm btn-light mb-2 btnSol" value="0.5">0.5 SOL</button>
				<button class="btn btn-sm btn-light mb-2 btnSol" value="1.0">1.0 SOL</button>
				<br>
				<button class="col-md-2 btn btn-warning btnDirection" value="left">LEFT</button>
				<button class="col-md-2 btn btn-warning btnDirection" value="right">RIGHT</button>
			</div>
			<div class="col-md-12 fixed-bottom mb-1" align="center">
				<button class="col-md-4 btn btn-light" id="connectWallet">Connect with Phantom</button>
				<button class="col-md-4 btn btn-danger" id="confirmSolSubmit" hidden>Confirm</button>
				<button class="col-md-4 btn btn-warning" id="kick" hidden>KICK</button>
				<button class="col-md-4 btn btn-success" id="btnWithdrawSOL" hidden>Withdraw SOL</button>
				<button class="col-md-4 btn btn-info" id="btnReplay">Replay</button>
			</div>
		</div>
	</div>
	<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/swal.min.js"></script>
	<script type="text/javascript" src="assets/fontawesome-free-5.13.0-web/js/all.min.js"></script>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="scripts/main.js"></script>
	<script type="text/javascript" src="solana-blockchain/ui.js"></script>
	<script type="text/javascript" src="solana-blockchain/snackbar.js"></script>
	<script type="text/javascript" src="solana-blockchain/utility.js"></script>
	<script type="text/javascript" src="solana-blockchain/gs.js"></script>
</body>
</html>