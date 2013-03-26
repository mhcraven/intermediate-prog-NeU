
window.onload = function(){

	var data = {
		"myImages": [
			{
				"id": "recycling",
				"src": "images/aluminum-cans.png"
			},
			{
				"id": "recycling-compost",
				"src": "images/brownbag.png"
			},
			{
				"id": "compost",
				"src": "images/sushi.png"
			},
			{
				"id": "compost",
				"src": "images/teabag.png"
			},
			{
				"id": "recycling",
				"src": "images/aluminum-foil.png"
			},
			{
				"id": "trash",
				"src": "images/chip_bag.png"
			},
			{
				"id": "compost",
				"src": "images/napkin.png"
			},
			{
				"id": "trash",
				"src": "images/styrofoam.png"
			},
			{
				"id": "compost",
				"src": "images/compostable_plasticcup.png"
			},
			{
				"id": "compost",
				"src": "images/papercoffeecup.png"
			},
			{
				"id": "compost",
				"src": "images/apple.png"
			},
			{
				"id": "trash",
				"src": "images/ketchup_mustard_packets.png"
			}
			
		]
	};

	
//AUDIO

	var wrongBin = document.getElementById("bad-sound");
	var correctBin = document.getElementById("good-sound");
	var introMusic = document.getElementById("intro-music");
	var highScoreBell = document.getElementById("bell-sound");

	var pauseMusicBtn = document.getElementById("pauseMusic-button");
	pauseMusicBtn.addEventListener( "click", musicPausePlay, false );

	introMusic.play();

	function musicPausePlay() {
		if (introMusic.paused){
			introMusic.play();
			pauseMusicBtn.value = "PAUSE MUSIC";
		}	else{
			introMusic.pause();
			pauseMusicBtn.value = "PLAY MUSIC";
		}
	}



//PLAY GAME

//buttons
	var startBtn = document.getElementById("start-button");
	startBtn.addEventListener( "click", startGame, false );

	var saveBtn = document.getElementById("save-button");
	saveBtn.addEventListener( "click", saveScore, false );

	var playAgainBtn = document.getElementById("playAgain-button");
	playAgainBtn.addEventListener( "click", startGame, false );

	var endGameBtn = document.getElementById("end-button");
	endGameBtn.addEventListener( "click", endGame, false );

//other global variables
	var nameField = document.getElementById("user-name");

	var theCount = document.getElementById("count");
	var theScore = document.getElementById("score");
	var count = 20;
	var i;

	var theItemTarget = document.getElementsByTagName("img")[0];

	var introScreen = document.getElementById("introScreen");
	var endScreen = document.getElementById("endScreen");

	function startGame(){
		
		reSet();

		//remove screens
		if (introScreen.getAttribute("class") === "screen"){
			introScreen.setAttribute("class", "no-screen");
		}

		if (endScreen.getAttribute("class") === "screen"){
			endScreen.setAttribute("class", "no-screen");
		}
		
		displayNewItem();
		startCountDown();
	}

	function startCountDown(){

		theCount.innerHTML = count--;
		//start countdown
		var x = setTimeout( startCountDown, 1000 );
			if ( count < 0 ){
				clearTimeout(x);
				displayEndScreen();
			}
	}

	function getScore(){
		return theScore.innerHTML;
	}

	function endGame(){

		if (introScreen.getAttribute("class") === "no-screen"){
			introScreen.setAttribute("class", "screen");
		}

		if (endScreen.getAttribute("class") === "screen"){
			endScreen.setAttribute("class", "no-screen");
		}

		if (theScore.getAttribute("class") === "green-score"){
			theScore.setAttribute("class", "black-score");
		}
	}

	function displayEndScreen() {
		theItemTarget.removeAttribute("class");
		theItemTarget.setAttribute("draggable", "false");

			//if the score is one of the top 3 scores add it to the leaderboard
			
			if ( getScore() < 50 ){
				endScreen.setAttribute("class", "screen");
				document.getElementById("saveScoreOpt").innerHTML = "Your score is: " + getScore() + " <br> Play again and try to improve your score!";
				saveBtn.setAttribute("class", "no-screen");
				nameField.setAttribute("class", "no-screen");
			}	/*else if ( getScore() >= 10 && validateScore() === false ) {
					endScreen.setAttribute("class", "screen");
					document.getElementById("saveScoreOpt").innerHTML = "Your score is: " + getScore() + " <br> Nice job! Play again to try and add your name to the list of Top Players!";
					saveBtn.setAttribute("class", "no-screen");
					nameField.setAttribute("class", "no-screen");
				}*/	else if ( getScore() >= 50 ){
						endScreen.setAttribute("class", "screen");
						document.getElementById("saveScoreOpt").innerHTML = "Your score is: " + getScore() + " <br> Nice job! Your score is one of the top scores. Add your name to the leader board or play again!";
						saveBtn.setAttribute("class", " ");
						nameField.setAttribute("class", " ");
					}	
	}

	function reSet(){
		if ( count !== 20 ){
			count = 20;
		}
		//reset counter to 20 seconds
		theCount.innerHTML = 20;

		//reset score to zero 
		theScore.innerHTML = 0;
		theScore.setAttribute("class", "black-score");
	}

	function displayNewItem () {
		var i = Math.floor(Math.random() * data.myImages.length);
		var theNewImageSource = data.myImages[i].src;
		var theNewImageId = data.myImages[i].id;
		theItemTarget.setAttribute("src", theNewImageSource);
		theItemTarget.setAttribute("id", theNewImageId);
	}
		
	function addPoints(){
		correctBin.play();

		theScore.innerHTML = parseInt(theScore.innerHTML, 10) + 10;

		if ( theScore.innerHTML == 0 ){
			theScore.setAttribute("class", "black-score");
		}	
		if ( theScore.innerHTML == 50 ){
			theScore.setAttribute("class", "green-score");
			highScoreBell.play();
		}	
	}

	function subtractPoints(){
		wrongBin.play();

		theScore.innerHTML = parseInt( theScore.innerHTML, 10 ) - 10;
		
		if ( theScore.innerHTML < 0 ){
			theScore.setAttribute("class", "red-score");
		}
		if ( theScore.innerHTML == 40 ){
			theScore.setAttribute("class", "black-score");
		}
	}

	
//DRAG  (YUI http://yuilibrary.com/yui/docs/dd/)

	YUI({ filter: 'raw' }).use('dd-drop', 'dd-proxy', 'dd-constrain', 'dd-ddm-drop', function(Y) {

		var ddItem = new Y.DD.Drag({
	        node: '.drag',
		});

		ddItem.on('drag:start', function(){
	        var	n = this.get('node');
	            n.setStyle('opacity', .25);
		});

		function removeHoverState(e) {
			var dropTarget = e.drop.get('node');
			var targetId = dropTarget.get('id');

	        if ( targetId === "binR" ){
	        	dropTarget.setAttribute("src", "images/singlestream.png");
	        }
	        if ( targetId === "binT" ){
	        	dropTarget.setAttribute("src", "images/trash.png");
	        }
	        if ( targetId === "binC" ){
	        	dropTarget.setAttribute("src", "images/compost.png");
	        }
	    }

	    function addHoverState(e){
	    	var dropTarget = e.drop.get('node');
			var targetId = dropTarget.get('id');

	    	if ( targetId === "binR" ){
	        	dropTarget.setAttribute("src", "images/singlestream-hover.png");
	        }
	        if ( targetId === "binT" ){
	        	dropTarget.setAttribute("src", "images/trash-hover.png");
	        }
	        if ( targetId === "binC" ){
	        	dropTarget.setAttribute("src", "images/compost-hover.png");
	        }
	    }

	    ddItem.on('drag:enter', function(e){
			addHoverState(e);	    	
		});

		ddItem.on('drag:exit', function(e){
			 removeHoverState(e);
		});
		
		var dropNodes = Y.Node.all('.target');
		
		dropNodes.each(function(v, k) {
	    	var tar = new Y.DD.Drop({
	        node: v
		        });
	    });   

		Y.DD.DDM.on('drag:drophit', function(e) {
   
	       	var itemDragged = e.drag.get('node');
	       	var thisItemId = itemDragged.get('id');

	       	var dropTarget = e.drop.get('node');
	       	var targetId = dropTarget.get('id');

	       	var theData = data.myImages;

	       	removeHoverState(e);	       

	       	if ( targetId === "binR" && thisItemId === "recycling" || targetId === "binR" && thisItemId === "recycling-compost"){
	       	 	addPoints();
	       	} 
		       	else if ( targetId === "binT" && thisItemId === "trash" ){
		       	 	addPoints();
		       	} 
		       	else if ( targetId === "binC" && thisItemId === "compost" || targetId === "binR" && thisItemId === "recycling-compost"){
		       	 	addPoints();
		       	} 	
		       		else {
		       			subtractPoints();
		       		}

	       	displayNewItem ()	
	    });

	    ddItem.on('drag:end', function(e) {
	       	e.preventDefault();
	        var n = this.get('node');
			n.setStyle('opacity', '1');
		});
	});
	

// STORE SCORES LOCALLY
	
	var scoreData = {"theStats" : []}; 
	var scoreArea = document.getElementById("scoreboard");
	
	/*function validateScore(){
		var storedItem = localStorage.getItem("scoreData");
		var convertObj = JSON.parse(storedItem);
		
		if ( convertObj.theStats[0].score === undefined || convertObj.theStats[0].score >= getScore() ){
			return false;
		} 	else  {
				return true; 
				
			}	
			console.log('didnt return anything');	
	}*/

	//add and store when 'add name' button is clicked
	function saveScore(){		
		if ( nameField.value == ""){
			nameField.value = "Anonymous";
		}

		//save name and score to JSON object
		scoreData.theStats.push( {"player": nameField.value,
									"score": getScore() } );
		
		//store JSON object locally
		var stringObj = JSON.stringify(scoreData);
		localStorage.setItem("scoreData", stringObj);

		//remove end screen
		endScreen.setAttribute("class", "no-screen");

		//add intro screen
		introScreen.setAttribute("class", "screen");

		reSet();

		displayScore();
	}


	function displayScore(){	
		var storedItem = localStorage.getItem("scoreData");
		var convertObj = JSON.parse(storedItem);
		
			//sort top five scores so highest score is at the top
		

			if (storedItem == null || storedItem == undefined) {
				alert("There are no previous scores saved.");
			}	else { 

			clearDisplay();

			if ( convertObj.theStats.length > 1 ){	
				sortScores( convertObj.theStats, "score");
			}
					for ( var i = 0; i < 5; i++ ){
						var li = document.createElement("li");
						li.innerHTML = "<em>" + convertObj.theStats[i].player + "</em>" + "<br> score: "+ convertObj.theStats[i].score;	
						scoreArea.appendChild(li);
					} 	
				}
			
	}

	function clearDisplay(){
		var theLi = document.getElementsByTagName("li");
		while (theLi[0]) theLi[0].parentNode.removeChild(theLi[0]);
	}
/*
	function clearLocalStorage(e){
		e.stopPropagation();
		localStorage.clear();
		clearDisplay();
	}*/

	//code for sorting obtained from http://stackoverflow.com/questions/979256/how-to-sort-an-array-of-javascript-objects
	var sortBy = function (field, reverse, primer){
		var key = function (x) {return primer ? primer(x[field]) : x[field]};

		   return function (a,b) {
		       var A = key(a), B = key(b);
		       return ((A < B) ? +1 :
		               (A > B) ? -1 : 0) * [-1,1][+!!reverse];                  
		   }
		}

	function sortScores(objects, key){
		objects.sort(sortBy('score', true, parseInt));
    }
  
	displayNewItem();
	displayScore();

}();


/*
var request = getHTTPObject();

request.open("POST", data/images.json", true);
request.send(null);
request.send();

(function(){
*/

