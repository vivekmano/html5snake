$(document).ready(function(){
	//define canvas variables
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');
	var w = $('#myCanvas').width();
	var h = $('#myCanvas').height();
	var cw = 15;
	var direction;
	var food;
	var score = 0;
	var speed = 130;
	var cellColor = "green";

	var gamePaused = false;
	var keysAllowed; //allows for disabling of keys entered while game is paused

	//snake array
	var snakeArray;

	function play(){
		if (typeof gameLoop != "undefined")
			clearInterval(gameLoop);
		gameLoop = setInterval(paint, speed);
		keysAllowed = true;
		$('#pause_overlay').fadeOut(100);
	}

	function pause(){
		clearInterval(gameLoop);
		keysAllowed = false;
		$('#pause_overlay').fadeIn(200);
	}

	//Initialize function
	function init(){
		createSnake();
		createFood();
		direction = "right";
		play();
	}

	init();

	function createSnake(){
		var length = 5;
		snakeArray = [];

		for(var i = length-1; i >= 0; i--){
			snakeArray.push({x: i, y: 0});  		
		}
	}

	function createFood(){
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw) 
		}
	}

	function paint(){
		//paint the canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0,0,w,h);

		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;

		if(direction == "right")
			nx++;
		else if (direction == "left")
			nx--;
		else if (direction == "up")
			ny--;
		else if (direction == "down")
			ny++;

		//check for hitting the sides or itself
		if (nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || checkCollision(nx, ny, snakeArray)){
			$('#final_score').html(score);
			$('#overlay').fadeIn(300);
			return;
		}

		//check for food eaten!
		if (nx == food.x && ny == food.y){
			var tail = {x: nx, y: ny};
			score++;
			//create new piece of food
			createFood();
		}
		else {
			var tail = snakeArray.pop();
			tail.x = nx;
			tail.y = ny;
		}

		snakeArray.unshift(tail);

		for(var i = 0; i < snakeArray.length; i++){
			var c = snakeArray[i];
			paintCell(c.x, c.y);
		}

		//paint the food
		paintCell(food.x, food.y);

		//if current score is higher than high score, change it
		checkScore(score);

		//display current score
		$('#score').html(' Your score: ' + score);
		//display high score
		$('#high_score').html(' High score: ' + localStorage.highscore);

	}

	function paintCell(x,y){
		ctx.fillStyle = cellColor;
		ctx.fillRect(x*cw,y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw,y*cw, cw, cw);
	}

	function checkCollision(x, y, array){
		for (var i = 0; i < array.length; i++){
			if (array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	function checkScore(score){
		if(localStorage.highscore == null){
			localStorage.highscore = score;
		}	
		else{
			if(score > localStorage.highscore)
				localStorage.highscore = score;	
		}
	}

	//create a keyboard controller
	$(document).keydown(function(e){
		var key = e.which;

		if (keysAllowed){
			if (key == '37' && direction != "right")
				direction = 'left';
			else if (key == '38' && direction != "down")
				direction = 'up';
			else if (key == '39' && direction != "left")
				direction = 'right';
			else if (key == '40' && direction != "up")
				direction = 'down';
		}

		if (key == 80)	//p for pause
		{
			gamePaused = !gamePaused;
			if (gamePaused)
				pause();
			else
				play();
		}

	})

});

function resetScore(){
	localStorage.highscore = 0;
}