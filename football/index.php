<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="icon" href="assets/img/kick2win.png">
	<link rel="shortcut icon" href="assets/img/kick2win.png">
	<!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
	<title>Welcome | Football Game</title>
	<link rel="stylesheet" type="text/css" href="styles/index.css">
	<link rel="stylesheet" type="text/css" href="assets/bootstrap-4.4.1-dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/fontawesome-free-5.13.0-web/css/all.min.css">
</head>
<body>
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
			<div class="col-md-12 fixed-center mb-5" align="center">
				<button class="col-md-2 btn btn-light" onclick="window.location='earn-mode.php'" value="left">Play-2-Earn <br> (2x your Solana)</button>&nbsp;&nbsp;
				<button class="col-md-2 btn btn-light" onclick="window.location='free-mode.php'" value="right">Free-2-Play <br> (Play for fun)</button>
			</div>
			<!-- <div class="col-md-12 fixed-bottom mb-5" align="center">
				<button class="col-md-2 btn btn-warning btnDirection" value="left">LEFT</button>
				<button class="col-md-2 btn btn-warning btnDirection" value="right">RIGHT</button>
			</div>
			<div class="col-md-12 fixed-bottom mb-1" align="center">
				<button class="col-md-4 btn btn-danger" id="kick">KICK</button>
			</div> -->
		</div>
	</div>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/fontawesome-free-5.13.0-web/js/all.min.js"></script>
	<script type="text/javascript" src="assets/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="scripts/main.js"></script>
</body>
</html>