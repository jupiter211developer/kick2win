window.addEventListener('load', function(){
	
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight;

	window.addEventListener('resize', function() {
		canvas.width = window.innerWidth; 
		canvas.height = window.innerHeight;
	});

	class Goalpost {
		constructor() {
			this.x = canvas.width/3;
			this.y = canvas.height/6.5;
			this.originalWidth = 184;
			this.originalHeight = 76;
			this.width = this.originalWidth/1;
			this.height = this.originalHeight/1;
			this.scale = 2.7;
			this.goalPostImg = new Image();
			this.goalPostImg.src = 'http://localhost/football/assets/img/Goalpost.png';
			this.frameX = 0;
			this.frameY = 0;
		}
		update() {

		}
		draw() {
			/*ctx.beginPath();
			ctx.save();
			ctx.strokeStyle = 'white';
			ctx.rect(this.x, this.y, this.width*this.scale, this.height*this.scale)
			ctx.stroke();*/
			ctx.drawImage(this.goalPostImg, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, (this.width) * this.scale, this.height * this.scale);
		}
	}

	class Goalkeeper {
		constructor() {
			this.x = canvas.width/2.3;
			this.y = canvas.height/3.8;
			this.originalWidth = 576;
			this.originalHeight = 192;
			this.width = this.originalWidth/9;
			this.height = this.originalHeight/3;
			this.scale = 2.2;
			this.goalKeeper = new Image();
			this.goalKeeper.src = 'http://localhost/football/assets/img/Goalkeeper_Sheet.png';
			this.frameX = 0;
			this.frameY = 0;
			this.direction = Math.random() > 0.5 ? 'right' : 'left';
		}
		update() {
			if (!ball.isKicked) {
				this.frameY = 0;
				if (frameCount % 6 == 0) {
					if (this.frameX < 7 && this.frameY == 0) {
						this.frameX++;
					}
					else {
						this.frameX = 0;
					}
				}
			}
			if (ball.isKicked) {
				if (this.direction == 'left') {
					this.frameY = 1;
					this.x -= 2;
					// this.x -= Math.floor(Math.random() * (3 - 2 +1) + 2);
				}
				if (this.direction == 'right') {
					this.frameY = 2;
					this.x += 2;
					// this.x += Math.floor(Math.random() * (3 - 2 +1) + 2);
				}
				if (frameCount % 10 == 0) {
					if (this.frameX < 2) {
						this.frameX++;
					}
					else {
						this.frameX = 2;
					}
				}
			}
		}
		draw() {
			/*ctx.beginPath();
			ctx.save();
			ctx.strokeStyle = 'white';
			ctx.rect(this.x, this.y, this.width*this.scale, this.height*this.scale)
			ctx.stroke();*/
			ctx.drawImage(this.goalKeeper, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width * this.scale, this.height * this.scale);
		}
	}

	class Kicker {
		constructor() {
			this.x = canvas.width/2.5;
			this.y = canvas.height/1.5;
			this.originalWidth = 576;
			this.originalHeight = 128;
			this.width = this.originalWidth/9;
			this.height = this.originalHeight/2;
			this.scale = 2.2;
			this.kickerImg = new Image();
			this.kickerImg.src = 'http://localhost/football/assets/img/Kicker_Sheet.png';
			this.frameX = 0;
			this.frameY = 0;
			this.kick = false;
			this.direction = Math.random() > 0.5 ? 'right' : 'left';
		}
		update() {
			if (!this.kick) {
				this.frameY = 0;
				if (frameCount % 6 == 0) {
					if (this.frameX < 7 && this.frameY == 0) {
						this.frameX++;
					}
					else {
						this.frameX = 0;
					}
				}
			}
			else if (this.kick && frameCount % 4 == 0) {
				this.frameY = 1;
				this.x+=9;
				this.y-=7;
				if (this.frameX < 8) {
					this.frameX++;
				}
				else {
					this.frameX = 0;
					ball.isKicked = true;
					this.kick = false;
				}
			}
			// console.log(this.frameX,this.frameY);

		}
		draw() {
			/*ctx.beginPath();
			ctx.save();
			ctx.strokeStyle = 'white';
			ctx.rect(this.x, this.y, this.width*this.scale, this.height*this.scale)
			ctx.stroke();*/
			ctx.drawImage(this.kickerImg, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width * this.scale, this.height * this.scale);
		}
	}

	class Ball {
		constructor() {
			this.x = canvas.width / 2.07;
			this.y = canvas.height / 1.3;
			this.originalWidth = 91;
			this.originalHeight = 13;
			this.width = this.originalWidth/7;
			this.height = this.originalHeight/1;
			this.scale = 3;
			this.ballImg = new Image();
			this.ballImg.src = 'http://localhost/football/assets/img/Soccerball.png';
			this.frameX = 0;
			this.frameY = 0;
			this.isKicked = false;
			this.direction = 'left';
			this.audianceSound = false;
		}
		update() {
			if (this.isKicked && this.y > canvas.height/3) {
				this.scale -= 0.0005;
				this.y -= Math.floor(Math.random() * (5 - 2 +1) + 2);
				if (this.direction == 'left') {
					this.x -= 2;
					// this.x -= Math.floor(Math.random() * (3 - 2 +1) + 2);
				}
				else if (this.direction == 'right') {
					this.x += 2;
					// this.x += Math.floor(Math.random() * (3 - 2 +1) + 2);
				}
			}
			else {
				this.isKicked = false;
				if (this.audianceSound) {

					if (goalKeeper.direction == this.direction) {
						setTimeout(function(){
							$('#upset').trigger('play');
						},1500);
						this.audianceSound = false;
					}
					else {
						setTimeout(function(){
							$('#cheers').trigger('play');
						},1500);
						this.audianceSound = false;

					}
				}
			}
		}
		draw() {
			/*ctx.beginPath();
			ctx.save();
			ctx.strokeStyle = 'white';
			ctx.rect(this.x, this.y, this.width*this.scale, this.height*this.scale)
			ctx.stroke();*/
			ctx.drawImage(this.ballImg, this.width * this.frameX, 0, this.width, this.height, this.x, this.y, this.width * this.scale, this.height * this.scale);
		}
	}

	let goalPost = new Goalpost();
	let goalKeeper = new Goalkeeper();
	let ball = new Ball();
	let kicker = new Kicker();
	let frameCount = 0;

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		goalPost.draw();
		goalKeeper.draw();
		ball.draw();
		kicker.draw();
		goalKeeper.update();
		ball.update();
		kicker.update();

		frameCount++;
		requestAnimationFrame(animate);
	}
	animate();

	$('#kick').on('click',function(){
		ball.audianceSound = true;
		var direction = $('#direction').val();
		if (direction.length == 0 || direction == null) {
			alert('Please select Direction');
			return false;
		}
		else {
			kicker.kick = true;
			ball.direction = direction;
		}
	});
	$('.btnDirection').on('click',function(){
		$('#direction').val($(this).val());
	});
});