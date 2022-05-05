<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="icon" href="assets/img/kick2win.png">
	<link rel="shortcut icon" href="assets/img/kick2win.png">
	<!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
	<title>FREE Mode | Football Game</title>
	<link rel="stylesheet" type="text/css" href="styles/index.css">
	<link rel="stylesheet" type="text/css" href="assets/bootstrap-4.4.1-dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/fontawesome-free-5.13.0-web/css/all.min.css">
</head>
<body>
	<audio id="cheers">
		<source src="sounds/cheers.wav" type="audio/wav">
	</audio>
	<audio id="upset">
		<source src="sounds/upset.mp3" type="audio/mp3">
	</audio>
	<canvas id="canvas"></canvas>
	<div id="data">
		<input type="hidden" id="direction" value="left">
	</div>
	<div class="row">
		<div class="col-md-9">
			<img src="assets/img/kick2win.png" style="width: 35%;height: 65%;">
		</div>
		<div class="col-md-3">
			<img src="assets/img/solana-full.png" class="mt-5" style="width: 90%;height: 15%;">
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-md-12 fixed-top mt-3" align="center">
				<span class="col-md-2 badge badge-light">Free Mode</span>
				<br>
				<span class="col-md-1 badge badge-danger" onclick="window.location='index.php'">Back</span>
			</div>
			<div class="col-md-12 fixed-bottom mb-5" align="center">
				<button class="col-md-2 btn btn-warning btnDirection" value="left">LEFT</button>
				<button class="col-md-2 btn btn-warning btnDirection" value="right">RIGHT</button>
			</div>
			<div class="col-md-12 fixed-bottom mb-1" align="center">
				<button class="col-md-4 btn btn-danger" id="kick">KICK</button>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/fontawesome-free-5.13.0-web/js/all.min.js"></script>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="scripts/main.js"></script>
</body>
</html>