var points = [];
var diceActive;
var diceDoubles;
var doubleDiceFill = 'orangered';
var singleDiceFill = 'orange';
var emptyDiceFill = 'white';
var diceDotFill = 'black';
var hotpoint1;
var hotpoint2;
var hotpoint3;
var element;
var initiated = false;
var player1Name = 1;
var player2Name = 2;
var p1CheckerFill = 'black';
var p2CheckerFill = 'brown';
var activeCheckerFill = 'purple';
var noPlayCheckerFill = 'maroon';
var pointActiveFill = 'green';
var point2MoveActiveFill = 'pink';
var edgeActiveFill = 'orange';
var edgeInActiveFill = 'blue';
var evenPointInactiveFill = 'white';
var oddPointInactiveFill = 'red';
var activeChecker;
var activePlayer;
var p1BarPoint = 200;
var p2BarPoint = 100;
var multiplayerGameID;
var playerCheckerCount = [0,0];

populateBoard();

function onLoad() {
	//svg.text(10, 20, error || 'Loaded into ' + this.id);
	//resetSize(svg, null, null); //'100%', '100%');
}

//Initiate required board pieces the first time
function initiate(){
  var checker;
  var di = 0;
  var dot;
  var player = 1;
  var cx;
  var cy;
  var rx;
  var svgns = 'http://www.w3.org/2000/svg';
  var element;

  // //Create all checker SVG objects
  // for (i = 1; i <= 15; i++) {
  //   checker = document.createElementNS(svgns, 'circle');
  //   checker.setAttributeNS(null, 'id', 'p' + player + 'c' + i);
  //   checker.setAttributeNS(null, 'r', '20');
  //   checker.setAttributeNS(null, 'stroke', 'black');
  //   checker.setAttributeNS(null, 'stroke-width', '1');
  //   checker.setAttributeNS(null, 'fill', player === 1 ? p1CheckerFill : p2CheckerFill);
  //   document.getElementById('svgObj').appendChild(checker);
  //
  //   //Loop through again for player 2
  //   if (player === 1 && i === 15) {
  //     i = 0;
  //     player = 2;
  //   }
  // }

  //Create Dice SVG objects
  for (i = 1; i <= 7; i++) {
    dx = di === 0 ? (i === 7 ? '130' : (isEven(i)  ? '141' : '119') ) : (i === 7 ? '190' : (isEven(i)  ? '201' : '179') );
    dy = i <= 2 ? 294 : ( i <= 4 ? 305 : ( i <= 6 ? 316 : 305));

    if (i === 1){
      rx = di === 0 ? '110' : '170';
      rect = document.createElementNS(svgns, 'rect');
      rect.setAttributeNS(null, 'id', 'd' + di);
      rect.setAttributeNS(null, 'stroke', 'black');
      rect.setAttributeNS(null, 'stroke-width', '1');
      rect.setAttributeNS(null, 'fill', singleDiceFill);
      rect.setAttributeNS(null, 'width', '40');
      rect.setAttributeNS(null, 'height', '40');
      rect.setAttributeNS(null, 'x', rx);
      rect.setAttributeNS(null, 'y', '285');
      document.getElementById('svgObj').appendChild(rect);
    }
    dot = document.createElementNS(svgns, 'circle');
    dot.setAttributeNS(null, 'id', 'd' + di + 'd' + i);
    dot.setAttributeNS(null, 'r', '4');
    dot.setAttributeNS(null, 'stroke', 'black');
    dot.setAttributeNS(null, 'stroke-width', '1');
    dot.setAttributeNS(null, 'fill', diceDotFill);
    dot.setAttributeNS(null, 'cx', dx);
    dot.setAttributeNS(null, 'cy', dy);
    document.getElementById('svgObj').appendChild(dot);

    //Loop through again for second di
    if (di === 0 && i === 7) {
      i = 0;
      di = 1;
    }
  }

  //Create top right points SVG objects
	for (i = 1; i <= 6; i++) {
		element = "t" + (13 - i);
		document.getElementById("t" + (13 - i))
			.setAttribute("points", i * 40 + " 0, " + (i * 40 + 20) + " 230, " + (i * 40 + 40) + " 0");
	}

  //Create top left points SVG objects
	for (i = 7; i <= 12; i++) {
		element = "t" + (13 - i);
		document.getElementById("t" + (13 - i))
			.setAttribute("points", (i * 40 + 40) + " 0, " + (i * 40 + 60) + " 230, " + (i * 40 + 80) + " 0");
	}

  //Create bottom left points SVG objects
	for (i = 1; i <= 6; i++) {
		element = "t" + (i + 12);
		document.getElementById("t" + (i + 12))
			.setAttribute("points", i * 40 + " 590, " + (i * 40 + 20) + " 360, " + (i * 40 + 40) + " 590");
	}

  //Create bottom right points SVG objects
	for (i = 7; i <= 12; i++) {
		element = "t" + (i + 12);
		document.getElementById("t" + (i + 12))
			.setAttribute("points", (i * 40 + 40) + " 590, " + (i * 40 + 60) + " 360, " + (i * 40 + 80) + " 590");
	}
}

//Reset button pressed
function resetBoard() {
  if(confirm('Are you sure you\'d like to reset the board?')){
    populateBoard();
  }
}

//Populate the board and reset game
function populateBoard() {
  var checkers;
  var player;

  if (!initiated) {
    initiate();
  }

  //Reset global variables
  activePlayer = 1;
  activeChecker = null;
  multiplayerGameID = null;
  diceActive = [false, false];
  diceDoubles = [false, false];
  hotpoint1 = 0;
  hotpoint2 = 0;
  hotpoint3 = 0;

  //Populate points globals
	for (i = 0; i <= 25; i++) {
    switch (i) {
      case 1:
        player = 1;
        checkers = initiateCheckers(player,2);
        break;
      case 6 || 13:
        player = 2;
        checkers = initiateCheckers(2,5);
        break;
      case 8:
        player = 2;
        checkers = initiateCheckers(2,3);
        break;
      case 12 || 19:
        player = 1;
        checkers = initiateCheckers(1,5);
        break;
      case 17:
        player = 1;
        checkers = initiateCheckers(1,3);
        break;
      case 24:
        player = 2;
        checkers = initiateCheckers(2,2);
        break;
      default:
        checkers = [];
    }
		points[i] = {
			id: i,
			count: 0,
      checkers: checkers,
			player: player
		};
	}

  //Populate bar point globals
  for (i = 100; i <= p1BarPoint; i+= p2BarPoint) {
    points[i] = {
      id: i,
      count: 0,
      checkers: [],
      player: 0
    };
  }

  // //Move checkers to their starting locations - Player 1
	// for (i = 1; i <= 2; i++) {
  //   initiateChecker(1, i, 1);
	// }
	// for (i = 3; i <= 7; i++) {
  //   initiateChecker(1, i, 12);
	// }
	// for (i = 8; i <= 10; i++) {
  //   initiateChecker(1, i, 17);
	// }
	// for (i = 11; i <= 15; i++) {
  //   initiateChecker(1, i, 19);
	// }
  //
  // //Move checkers to their starting locations - Player 2
	// for (i = 1; i <= 5; i++) {
  //   initiateChecker(2, i, 6);
	// }
	// for (i = 6; i <= 8; i++) {
  //   initiateChecker(2, i, 8);
	// }
	// for (i = 9; i <= 13; i++) {
  //   initiateChecker(2, i, 13);
	// }
	// for (i = 14; i <= 15; i++) {
  //   initiateChecker(2, i, 24);
	// }

  //Board has been initiated
  initiated = true;

  //Hide the dice
	hideDice();

  //Set player label to the active player (1)
  document.getElementById('playerLabel').innerHTML = activePlayer;
}

//Initiates a checker to its starting location
function initiateChecker(player, checkerIndex, point){
  checker = 'p' + player + 'c' + checkerIndex;
  moveChecker(checker, point, player, true);
  if(!initiated){
    $("#" + checker).click(function () {
        checkerClick(this);
      });
  }
}

function initiateCheckers(player, countOfCheckers){
  var checker;
  var curCheckers = [];
  var svgns = 'http://www.w3.org/2000/svg';

  for (var i = 1; i < countOfCheckers; i++) {
    checker = document.createElementNS(svgns, 'circle');
    checker.setAttributeNS(null, 'id', 'p' + player + 'c' + playerCheckerCount[player]);
    checker.setAttributeNS(null, 'r', '20');
    checker.setAttributeNS(null, 'stroke', 'black');
    checker.setAttributeNS(null, 'stroke-width', '1');
    checker.setAttributeNS(null, 'fill', player === 1 ? p1CheckerFill : p2CheckerFill);
    document.getElementById('svgObj').appendChild(checker);
    curCheckers.push(checker);
    playerCheckerCount[player]++;
  }
  return curCheckers;
}

//Function when checker is clicked
function checkerClick(checker) {
	var onPoint = checker.getAttribute("onPoint");
	var d1Val = document.getElementById("d1value").value;
	var d2Val = document.getElementById("d2value").value;
	var checkerID = checker.id;
	var player = parseFloat(checker.id.split("p")[1].split("c")[0]);
	var point1;
	var point2;
  var point3;
	var numOnPoint = parseFloat(onPoint);
	var numD1 = parseFloat(d1Val);
	var numD2 = parseFloat(d2Val);
  var playerOnBar = player === 1 ? points[p1BarPoint].count !== 0 : points[p2BarPoint].count !== 0;
  var barPieceSelected = false;
  var canPlay = false;
  var canGoHome = false;
  var topChecker = findTopChecker(numOnPoint);


  //Clears selected checker if it is the active one
  if (activeChecker && activeChecker === checker) {
    resetActive();
    return false;
  }

  //Assumes player is moving the active checker to the point under the selected checker if an available move
  else if (activeChecker && activePlayer === player && ('t' + numOnPoint === hotpoint1 || 't' + numOnPoint === hotpoint2|| 't' + numOnPoint === hotpoint3)) {
    pointClick(activeChecker.id, document.getElementById('t' + numOnPoint), player);
  }

  //If a checker is not active and the selected checker belongs to the player, continue to check for available moves
  else if (!activeChecker || activePlayer === player) {

    //Select the top checker on the point if this is not the top checker
    if(topChecker != checker){
      checkerClick(topChecker);
      return false;
    }
    //Set points and prerequisites for moves
  	if (player === 1) {
      canGoHome = points[19].count + points[20].count + points[21].count + points[22].count + points[23].count + points[24].count + points[25].count === 15;
      barPieceSelected = numOnPoint === p1BarPoint;
      numOnPoint = barPieceSelected ? 0 : numOnPoint;
  		point1 = (numOnPoint + numD1);
  		point2 = (numOnPoint + numD2);
      point3 = (numOnPoint + numD1 + numD2);
  	} else {
      canGoHome = points[0].count + points[1].count + points[2].count + points[3].count + points[4].count + points[5].count + points[6].count === 15;
      barPieceSelected = numOnPoint === p2BarPoint;
      numOnPoint = barPieceSelected ? 25 : numOnPoint;
  		point1 = (numOnPoint - numD1);
  		point2 = (numOnPoint - numD2);
      point3 = (numOnPoint - numD1 - numD2);
  	}

    //Reset any active points
    resetActive();

    //If the player is the active player and they're either not on the bar or have selected a bar piece
    if ( player === activePlayer && (!playerOnBar || barPieceSelected ))
    {
      //Checks for an available move using the first di and activates the relevant point
    	if (diceActive[0] && points[point1] && (points[point1].player === 0 || points[point1].player === player || points[point1].count === 1) && ((point1 !==0 && point1 !==25) || canGoHome )) {
        canPlay = true;
        hotpoint1 = 't' + point1;
    		$('#t' + point1).attr("fill", (point1 === 0 || point1 === 25 ? edgeActiveFill : pointActiveFill));
    		$('#t' + point1).click(function () {
    				pointClick(checkerID, document.getElementById('t' + point1), player);
    			});
    	}

      //Checks for an available move using the second di and activates the relevant point
    	if (diceActive[1] && (!diceActive[0] || point1 !== point2) && points[point2] && (points[point2].player === 0 || points[point2].player === player || points[point2].count === 1) && ((point2 !==0 && point2 !==25) || canGoHome )) {
        canPlay = true;
        hotpoint2 = 't' + point2;
    		$('#t' + point2).attr("fill", (point2 === 0 || point2 === 25 ? edgeActiveFill : pointActiveFill));
    		$('#t' + point2).click(function () {
    				pointClick(checkerID, document.getElementById('t' + point2), player);
    			});
    	}

      //Checks for an available move using both dice and activates the relevant point
      if (diceActive[0] && diceActive[1] && points[point3] && (points[point3].player === 0 || points[point3].player === player || points[point3].count === 1) && ((point3 !==0 && point3 !==25) || canGoHome )) {
        canPlay = true;
        hotpoint3 = 't' + point3;
    		$('#t' + point3).attr("fill", (point3 === 0 || point3 === 25 ? edgeActiveFill : point2MoveActiveFill));
    		$('#t' + point3).click(function () {
    				pointClick(checkerID, document.getElementById('t' + point3), player);
    			});
    	}
    }

    //Activates the selected checker if there is a valid move
    if (canPlay) {
      activeChecker = checker;
      $(checker).attr('fill', activeCheckerFill);
    }

    //Flashes the checker if there are no valid moves
    else {
        $(checker).attr('fill', noPlayCheckerFill);
        setTimeout(function(){
          $(checker).attr('fill', player === 1 ? p1CheckerFill : p2CheckerFill);
        }, 500);
    }
  }

  //Flashes the checker as it doesn't belong to the player or they are on the bar
  else {
        $(checker).attr('fill', noPlayCheckerFill);
        setTimeout(function(){
          $(checker).attr('fill', player === 1 ? p1CheckerFill : p2CheckerFill);
        }, 500);
  }
}

//Reset all active checkers and points
function resetActive() {
  if (activeChecker) {
    $(activeChecker).attr('fill', activePlayer == 1 ? p1CheckerFill : p2CheckerFill);
      activeChecker = null;
    resetPoints();
  }
}

//Reset all hot points
function resetPoints() {
	resetPoint(document.getElementById(hotpoint1));
	resetPoint(document.getElementById(hotpoint2));
	resetPoint(document.getElementById(hotpoint3));
  hotpoint1 = null;
  hotpoint2 = null;
  hotpoint3 = null;
}

//Resets a single point
function resetPoint(point) {

  //Verify the point is not null
  if(point){
  	$(point).unbind("click");
    var pointN = pointNumber(point);
    if (pointN === 0 || pointN === 25 ) {
      $(point).attr("fill", edgeInActiveFill);
    }
  	else if (isEven(pointN)) {
  		$(point).attr("fill", evenPointInactiveFill);
  	}
    else {
  		$(point).attr("fill", oddPointInactiveFill);
  	}
  }
}

//Gets the point number value from the point DOM object id
function pointNumber(point) {
	return parseFloat(point.id.split("t")[1]);
}

//Returns true if parameter is even
function isEven(n) {
	return parseFloat(n) && (n % 2 == 0);
}

//Function for when a point is clicked
function pointClick(checkerID, point, player) {
  var checkerPoint = document.getElementById(checkerID).getAttribute('onPoint');

  //Moves the checker to its new point
	moveChecker(checkerID, pointNumber(point), player);

  //Resets any active hot points
	resetActive();

  //Gets the distance between the checker point and the new point
  var distance = Math.abs(checkerPoint - pointNumber(point));

  //Point selected uses both dice values
  if (parseFloat(document.getElementById("d1value").value) + parseFloat(document.getElementById("d2value").value)  === distance) {
    updateDi(0);
    updateDi(1);
  }

  //Point selected uses first di value
	else if (diceActive[0] && document.getElementById("d1value").value == distance) {
    updateDi(0);

  //Point selected uses second di value
	} else {
    updateDi(1);
	}

  //Change to alternate player if there are no dice  values left
  if (!diceActive[0] && !diceActive[1]){
    activePlayer = activePlayer === 1 ? 2 : 1;
    document.getElementById('playerLabel').innerHTML = activePlayer;
  }

	return true;
}

//Moves a checker without specifying a clear board
function moveChecker(checkerID, pointNumber, player){
  moveChecker(checkerID, pointNumber, player, false);
}

//Moves a checker
function moveChecker(checkerID, pointNumber, player, clearBoard) {

  //Gets the checker's current point location
  var curPoint = document.getElementById(checkerID).getAttribute('onPoint');

  if (curPoint !== pointNumber) {

    //Only adjust the original point's count and player if the board is not being cleared and the checker is on a current point
    if (!clearBoard && curPoint) {
        points[curPoint].count--;
      if (points[curPoint].count === 0) {
        points[curPoint].player = 0;
      }
    }

    //Get the new x y coordinates of the checker
    res = calcCheckerXY(pointNumber, player);

    //Set the checker x and y coordinates and its new point number
    document.getElementById(checkerID).setAttribute("onPoint", pointNumber);
    document.getElementById(checkerID).setAttribute("collapsed", false);
  	document.getElementById(checkerID).setAttribute("cx", res[0]);
  	document.getElementById(checkerID).setAttribute("cy", res[1]);

    //Adjust the checkers on each point
    adjustCheckers(pointNumber);
    adjustCheckers(curPoint);

    checkForWin();

  }
}

//Calculates the new x and y coordinates of where to place a checker on a point
function calcCheckerXY(pointNumber, player) {
	var result = [];
	var count;

  //If the new checker is hitting an opponents single checker, send them to the bar
  if (pointNumber != p1BarPoint && pointNumber != p2BarPoint && points[pointNumber].player != 0 && points[pointNumber].player != player) {

    //Send opponent checker to bar
    moveChecker($('[onPoint=' + pointNumber +']').attr('id'), player == 2 ? p1BarPoint : p2BarPoint, points[pointNumber].player);
  }

  //Update the current point player
  points[pointNumber].player = player;

  //Update the count of checkers on the current point
  count = points[pointNumber].count;

  //Calculate the new x and y coordinates for the checker
  if (pointNumber <= 6) {
		result[0] = 580 - (pointNumber * 40);
		result[1] = (count * 42) + 21;
	} else if (pointNumber <= 12) {
		result[0] = 540 - (pointNumber * 40);
		result[1] = (count * 42) + 21;
	} else if (pointNumber <= 18) {
		result[0] = 20 + ((pointNumber - 12) * 40);
		result[1] = 550 - (count * 42) + 21;
	} else if (pointNumber <= 25) {
		result[0] = 60 + ((pointNumber - 12) * 40);
		result[1] = 550 - (count * 42) + 21;
	} else if (pointNumber == p1BarPoint)  {
    result[0] = 300;
    result[1] = 550 - (count * 42) + 21;
  } else {
		result[0] = 300;
		result[1] = (count * 42) + 21;
	}

  //Add one to the count of checkers on this point
	points[pointNumber].count++;

	return result;
}

//Rolls the dice (Roll Dice button)
function rollDice() {
  var canPlay;

  //Get random numbers for the dice
	var value1 = Math.floor((Math.random() * 6) + 1);
	var value2 = Math.floor((Math.random() * 6) + 1);

  resetActive();
	clearDice();

  //Set the new values of the dice
	document.getElementById("d1value").value = value1;
	document.getElementById("d2value").value = value2;

  //Populate the dots on the dice
	populateDi(0, value1);
	populateDi(1, value2);

  //Verify there is a play with the new dice values
  canPlay = verifyCanPlay();

  //Show the dice if there is a play
	showDice(canPlay, value1 === value2);

  //Set the dice active if there is a play
	diceActive = [canPlay,canPlay];
}

//Populates/shows the relevant dots on a di
function populateDi(di, number) {
	if (number == 1 || number == 3 || number == 5) {
		$("#d" + di + "d7").css("visibility", "visible");
	}
	if (number >= 2) {
		$("#d" + di + "d1").css("visibility", "visible");
		$("#d" + di + "d6").css("visibility", "visible");
	}
	if (number >= 4) {
		$("#d" + di + "d2").css("visibility", "visible");
		$("#d" + di + "d5").css("visibility", "visible");
	}
	if (number == 6) {
		$("#d" + di + "d3").css("visibility", "visible");
		$("#d" + di + "d4").css("visibility", "visible");
	}
}

//Hides the dice
function hideDice() {
	$("#d0").css("visibility", "hidden");
	$("#d1").css("visibility", "hidden");
	clearDice();
}

//Clears the dots on the dice
function clearDice() {
	for (i = 1; i <= 7; i++) {
		$("#d0d" + i).css("visibility", "hidden");
		$("#d1d" + i).css("visibility", "hidden");
	}
}

//Updates the fill color of a di
function updateDi(diNumber){

  //If the di is currently a double, set it to a single
  if (diceDoubles[diNumber]) {
    diceDoubles[diNumber] = false;
    $('#d' + diNumber).css('fill', singleDiceFill);
  }

  //If the di is currently a single, set it to inactive
  else {
    diceActive[diNumber] = false;
    $('#d' + diNumber).css('fill', emptyDiceFill);
  }
}

//Shows the dice based on whether the player has an available move and if it is a double
function showDice(canPlay, doubles) {
  diceDoubles = [doubles,doubles];
  $("#d0").css('fill', canPlay ? (doubles ? doubleDiceFill : singleDiceFill) : emptyDiceFill);
	$("#d0").css("visibility", "visible");
  $("#d1").css('fill', canPlay ? (doubles ? doubleDiceFill : singleDiceFill) : emptyDiceFill);
	$("#d1").css("visibility", "visible");
}

//Verifies the player has an available move to play
function verifyCanPlay() {
  var canPlay = true;
  var playerOnBar = activePlayer === 1 ? points[p1BarPoint].count !== 0 : points[200].count !== 0;

  //Get the numbers/locations of the current points
	var point1 = parseFloat(document.getElementById("d1value").value);
	var point2 = parseFloat(document.getElementById("d2value").value);

  //Player 2 needs their location relative to their home point (Player 1's home point is 0)
  if (activePlayer === 2) {
    point1 = 25 - point1;
    point2 = 25 - point2;
  }

  // TODO: If the player is on the bar, they can only play if the point their own or has 0/1 pieces
  if (playerOnBar) {
    canPlay = ((points[point1].player === activePlayer || points[point1].count <= 1)) || ((points[point2].player === activePlayer || points[point2].count <= 1));
  }

  return canPlay;
}

//Collapses the checkers on a point
function adjustCheckers(pointNumber){
  //Collapse the checkers on the current point if there are more than 5 total
  if (pointNumber && points[pointNumber].count > 5) {
  //Find all non-collapsed checkers on this point
    $("[onPoint=" + pointNumber +"][collapsed!='true']").each(function() {
      //Calculate the new y coordinate of the checker
      var curY = parseFloat($(this).attr('cy'));
      var newY = pointNumber <= 12 ? curY / 2 : ((curY - 570) / 2) + 570;

      //Set the new y coordinate of the checker and it's "collapsed" value to true
      $(this).attr('cy', newY);
      $(this).attr('collapsed', 'true');
    });
  }
  else if (pointNumber) {
    //Find all collapsed checkers on this point
      $("[onPoint=" + pointNumber +"][collapsed='true']").each(function() {
        //Calculate the new y coordinate of the checker
        var curY = parseFloat($(this).attr('cy'));
        var newY = pointNumber <= 12 ? curY * 2 : ((curY - 570) * 2) + 570;

        //Set the new y coordinate of the checker and it's "collapsed" value to true
        $(this).attr('cy', newY);
        $(this).attr('collapsed', 'true');
      });
  }
}

//Find the top checker on the point
function findTopChecker(pointNumber){
  var selectedChecker;
  //Find all checkers on this point
  $("[onPoint=" + pointNumber +"]").each(function() {
    //Update selectedChecker if it is null or the found checker is above the selected checker
    if (!selectedChecker || (pointNumber > 12 ? parseFloat($(this).attr('cy')) < parseFloat($(selectedChecker).attr('cy')) : parseFloat($(this).attr('cy')) > parseFloat($(selectedChecker).attr('cy')))) {
      selectedChecker = this;
    }
  });

  return selectedChecker;
}

//Check if the player has won the game
function checkForWin(){
  var wonGame = activePlayer === 1 ? points[25].count === 15 : point[0].count === 15;
  if (wonGame) {
    document.getElementById('playerLabel').innerHTML = activePlayer + ' WON THE GAME!!!';
    hideDice();
  }
  return wonGame;
}

//Open the modal window to start a 2 player game
function initiate2Player(){
  var modal = document.getElementById('2PlayerModal');
  modal.style.display = 'block';
}

//Retrieve player names and setup a 2 player game
function submitPlayerNames(){
  var modal = document.getElementById('2PlayerModal');
  modal.style.display = 'none';
  var player1Name = document.getElementById('Player1Input').value;
  var player2Name = document.getElementById('Player2Input').value;
  get2PlayerGameData(player1Name, player2Name);
}

//Get unique game id of 2 player game
function get2PlayerGameData(player1Name, player2Name){
  var gameID;
  var gameData;
  var onlineGameData = $.getJSON('http://blog.recroomrecords.com/code/activegames.json');
  for (var activeGame in onlineGameData.ActiveGames){
    if (activeGame.playerOne === player1Name) {
      gameID = activeGame.uniqueID;
    }
  }
  if (!gameID) {
    gameID = guid();
    gameData = {
      'uniqueID': gameID,
      'player1':player1Name,
      'player2':player2Name,
      'activePlayer':1,
      'player1Checkers':{1:2,12:5,17:3,19:5},
      'player2Checkers':{6:5,8:3,13:5,24:2}
    };
  }

  multiplayerGameID = gameID;
  populate2PlayerGame(gameData);
}

function populate2PlayerGame(gameData){
  var checkerNumber = 1;
  var pointData;
  var pointNumber;
  var i;

  pointData = gameData.player1Checkers;
  for (pointNumber in pointData){
    for (i = 1; i <= pointData[pointNumber]; i++) {
      moveChecker('p1c' + checkerNumber, pointNumber, 1, false);
      checkerNumber++;
    }
  }

  checkerNumber = 1;
  pointData = gameData.player2Checkers;
  for (pointNumber in pointData){
    for (i = 1; i <= pointData[pointNumber]; i++) {
      moveChecker('p2c' + checkerNumber, pointNumber, 1, false);
      checkerNumber++;
    }
  }

  player1Name = gameData.player1;
  player2Name = gameData.player2;
  activePlayer = gameData.activePlayer;
}

function update2PlayerGameData(){

  var gameData = {
    multiplayerGameID: {
    'player1':player1Name,
    'player2':player2Name,
    'activePlayer':activePlayer,
    'points':points
  }};

  var onlineGameData = $.getJSON('http://blog.recroomrecords.com/code/activegames.json');
  for (var activeGame in onlineGameData.ActiveGames){
    if (activeGame === multiplayerGameID) {
      onlineGameData.ActiveGames[multiplayerGameID] = gameData;
    }
  }

  //write the game data to the server
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


//Re-Populates the board from points object
function repopulateCheckers(points){

}
