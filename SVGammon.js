/*jshint esversion: 6 */

var points = [];
var doubleDiceFill = 'orangered';
var singleDiceFill = 'orange';
var emptyDiceFill = 'white';
var diceDotFill = 'black';
var hotpoint1;
var hotpoint2;
var hotpoint3;
var element; 
var initiated = false;
var checkerFill = ['', 'black', 'brown'];
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
var activeDice;
var multiplayerGameID;
var playerCheckerCount = [0, 0, 0];
var dice = [];
var channel;
var firebaseData;
var localPlayer;
var diceRolled = false;
var players;

populateBoard();

//Initiate required board pieces the first time
function initiate() {
	var di = 0;
	var dot;
	var rx;
	var svgns = 'http://www.w3.org/2000/svg';

	players = [new boardPlayer(0, 1000, 1000), new boardPlayer(1, 27, 0), new boardPlayer(2, 26, 25)];

	//Declare reference objects
	var parentContent = document.getElementById("svgObj");
    var parentWidth = parentContent.width.baseVal.value;
	var parentHeight = parentContent.height.baseVal.value;
	var diceHeight = parentHeight * 0.08;
	var diceTop = (parentHeight / 2) - diceHeight;
	var di0Left = (parentHeight / 4) - diceHeight;
	var di1Left = (parentHeight / 4) + diceHeight;
	var diceDotRadius = diceHeight / 10;


	//Size Board Backgaround Objects
	var boardWidth = parentHeight * 1.05;
	var bar = document.getElementById('bar');
	var ledge = document.getElementById('ledge');
	var p1home = document.getElementById('t0');
	var p2home = document.getElementById('t25');

	bar.setAttribute('points', parentHeight / 2.1 + ' 0, ' + parentHeight / 1.85 + ' 0, ' + parentHeight / 1.85 + ' ' + parentHeight + ', ' + parentHeight / 2.1 + ' ' + parentHeight);
	ledge.setAttribute('points', '0 0, ' + parentHeight / 14.75 + ' 0, ' + parentHeight / 14.75 + ' ' + parentHeight + ', 0 ' + parentHeight);
	p1home.setAttribute('points', (boardWidth - (boardWidth / 14.75)) + ' 0, ' + boardWidth + ' 0, ' + boardWidth + ' ' + parentHeight / 2 + ', ' + (boardWidth - (boardWidth / 14.75)) + ' ' + parentHeight / 2);
	p2home.setAttribute('points', (boardWidth - (boardWidth / 14.75)) + ' ' + parentHeight / 2 + ', ' + boardWidth + ' ' + parentHeight / 2 + ', ' + boardWidth + ' ' + parentHeight + ', ' + (boardWidth - (boardWidth / 14.75)) + ' ' + parentHeight);


	//Create Dice SVG objects
	for (i = 0; i <= 6; i++) {
		dx = di === 0 ? (i === 6 ? di0Left + (diceHeight / 2) - (diceDotRadius / 2) : (isEven(i) ? di0Left + (diceHeight / 4) - (diceDotRadius / 2) : di0Left + (diceHeight * 0.75) - (diceDotRadius / 2))) : (i === 6 ? di1Left + (diceHeight / 2) - (diceDotRadius / 2) : (isEven(i) ? di1Left + (diceHeight / 4) - (diceDotRadius / 2) : di1Left + (diceHeight * 0.75) - (diceDotRadius / 2)));
		dy = i <= 1 ? diceTop + diceHeight / 4 : (i <= 3 ? diceTop + diceHeight / 2 : (i <= 5 ? diceTop + diceHeight * 0.75 : diceTop + diceHeight / 2));

		if (i === 0) {
			rx = di === 0 ? di0Left : di1Left;
			rect = document.createElementNS(svgns, 'rect');
			rect.setAttribute('id', 'd' + di);
			rect.setAttribute('stroke', 'black');
			rect.setAttribute('stroke-width', '1');
			rect.setAttribute('width', diceHeight);
			rect.setAttribute('height', diceHeight);
			rect.setAttribute('x', rx);
			rect.setAttribute('y', diceTop);
			document.getElementById('svgObj')
				.appendChild(rect);
			dice[di] = new boardDi(di, rect);
		}
		dot = document.createElementNS(svgns, 'circle');
		dot.setAttribute('id', 'd' + di + 'd' + i);
		dot.setAttribute('r', diceDotRadius);
		dot.setAttribute('stroke', 'black');
		dot.setAttribute('stroke-width', '1');
		dot.setAttribute('fill', diceDotFill);
		dot.setAttribute('cx', dx);
		dot.setAttribute('cy', dy);
		document.getElementById('svgObj')
			.appendChild(dot);
		dice[di].dots[i] = dot;

		//Loop through again for second di
		if (di === 0 && i === 6) {
			i = -1;
			di = 1;
		}
	}

	//Create top right points SVG objects
	for (i = 1; i <= 6; i++) {
		document.getElementById("t" + (13 - i))
			.setAttribute("points", i * (parentHeight / 14.75) + ' 0, ' + (i * (parentHeight / 14.75) + (parentHeight / 29.5)) + ' ' + parentHeight * 0.4 + ', ' + (i * (parentHeight / 14.75) + (parentHeight / 14.75)) + ' 0');
	}

	//Create top left points SVG objects
	for (i = 7; i <= 12; i++) {
		document.getElementById("t" + (13 - i))
			.setAttribute("points", (i * (parentHeight / 14.75) + (parentHeight / 14.75)) + " 0, " + (i * (parentHeight / 14.75) + (parentHeight / (590/60))) + ' ' + parentHeight * 0.4 + ', ' + (i * (parentHeight / 14.75) + (parentHeight / 7.375)) + ' 0');
	}

	//Create bottom left points SVG objects
	for (i = 1; i <= 6; i++) {
		document.getElementById("t" + (i + 12))
			.setAttribute("points", i * (parentHeight / 14.75) + ' ' + parentHeight + ', ' + (i * (parentHeight / 14.75) + (parentHeight / 29.5)) + ' ' + parentHeight * 0.6 + ', ' + (i * (parentHeight / 14.75) + (parentHeight / 14.75)) + ' ' + parentHeight);
	}

	//Create bottom right points SVG objects
	for (i = 7; i <= 12; i++) {
		document.getElementById("t" + (i + 12))
			.setAttribute("points", (i * (parentHeight / 14.75) + (parentHeight / 14.75)) + ' ' + parentHeight + ', ' + (i * (parentHeight / 14.75) + (parentHeight / (590/60))) + ' ' + parentHeight * 0.6 + ', ' + (i * (parentHeight / 14.75) + (parentHeight / 7.375)) + ' ' + parentHeight);
	}

	//Setup onEnter event listeners for Online Game Modal
	document.getElementById('Player1Input')
		.addEventListener('keyup', onlineModalKeyPress);
	document.getElementById('Player2Input')
		.addEventListener('keyup', onlineModalKeyPress);
}

//Reset button pressed
function resetBoard() {
	if (confirm('Are you sure you\'d like to reset the board?')) {
		populateBoard();
		if (multiplayerGameID) {
			update2PlayerGameData();
		}
	}
}

//Populate the board and reset game
function populateBoard() {
	var checkers;
	var player;
	var pointData = [];

	if (!initiated) {
		initiate();
		//Board has been initiated
		initiated = true;
	}

	//Reset global variables
	activePlayer = players[1];
	activeChecker = null;
	dice[0].curValue = 0;
	dice[1].curValue = 0;
	dice[0].double = false;
	dice[1].double = false;
	dice[0].active = false;
	dice[1].active = false;
	hotpoint1 = 0;
	hotpoint2 = 0;
	hotpoint3 = 0;
	playerCheckerCount = [0, 0, 0];

	//Populate points globals
	for (i = 0; i <= 25; i++) {
		switch (i) {
		case 1:
			player = 1;
			checkers = 2;
			break;
		case 6:
		case 13:
			player = 2;
			checkers = 5;
			break;
		case 8:
			player = 2;
			checkers = 3;
			break;
		case 12:
		case 19:
			player = 1;
			checkers = 5;
			break;
		case 17:
			player = 1;
			checkers = 3;
			break;
		case 24:
			player = 2;
			checkers = 2;
			break;
		default:
			player = 0;
			checkers = 0;
		}
		pointData[i] = {
			id: i,
			checkers: checkers,
			player: player
		};
	}

	//Populate bar point globals
	for (i = players[2].barPoint; i <= players[1].barPoint; i++) {
		pointData[i] = {
			id: i,
			checkers: 0,
			player: 0
		};
	}

	points = populateBoardPoints(pointData);
	repopulateCheckers(points);

	//Set player label to the active player (1)
	document.getElementById('playerLabel')
		.innerHTML = activePlayer.name;
}

function populateBoardPoints(pointData) {
	var result = [];
	playerCheckerCount = [0, 0, 0];
	for (var key in pointData) {
		result[pointData[key].id] = (new boardPoint(pointData[key].id, pointData[key].checkers, players[pointData[key].player]));
	}
	return result;
}

function initiateCheckers(player, countOfCheckers) {
	var checker;
	var curCheckers = [];
	var svgns = 'http://www.w3.org/2000/svg';

	for (var i = 1; i <= countOfCheckers; i++) {
		checker = document.getElementById('p' + player.id + 'c' + playerCheckerCount[player.id]);
		if (!checker) {
			checker = document.createElementNS(svgns, 'circle');
			checker.setAttribute('id', 'p' + player.id + 'c' + playerCheckerCount[player.id]);
			checker.setAttribute('r', '20');
			checker.setAttribute('stroke', 'black');
			checker.setAttribute('stroke-width', '1');
			checker.setAttribute('fill', checkerFill[player.id]);
			checker.style.transition = '.5s';
			document.getElementById('svgObj')
				.appendChild(checker);
			checker.addEventListener('click', checkerClick);
		}
		curCheckers.push(checker);
		playerCheckerCount[player.id]++;
	}
	return curCheckers;
}

//Function when checker is clicked
function checkerClick(event) {
	var point1;
	var point2;
	var point3;
	var checker = event.target;
	var onPoint = checker.attributes.onPoint.value;
	var player = players[parseFloat(checker.id.split('p')[1].split('c')[0])];
	var numOnPoint = parseFloat(onPoint);
	var numD1 = parseFloat(dice[0].curValue);
	var numD2 = parseFloat(dice[1].curValue);
	var playerOnBar = points[player.barPoint].checkers.length > 0;
	var barPieceSelected = numOnPoint === player.barPoint;
	var canPlay = [false, false];
	var canGoHome = verifyCanGoHome(player);

	//select the top checker on the point
	checker = findTopChecker(numOnPoint);
	checkerID = checker.id;

	//Only continue if it is the local player's turn
	if (!localPlayer || localPlayer === activePlayer) {

		//Clears selected checker if it is the active one
		if (activeChecker && activeChecker === checker) {
			resetActive();
			return false;
		}

		//Assumes player is moving the active checker to the point under the selected checker if an available move
		else if (activeChecker && activePlayer === player && ('t' + numOnPoint === hotpoint1 || 't' + numOnPoint === hotpoint2 || 't' + numOnPoint === hotpoint3)) {
			pointClick({event: document.getElementById('t' + document.getElementById(activeChecker.id).getAttribute('onPoint'))});
		}

		//If a checker is not active and the selected checker belongs to the player, continue to check for available moves
		else if (!activeChecker || activePlayer === player) {

			//Set points and prerequisites for moves
			if (player.id === 1) {
				numOnPoint = barPieceSelected ? 0 : numOnPoint;
				point1 = (numOnPoint + numD1);
				point2 = (numOnPoint + numD2);
				point3 = (numOnPoint + numD1 + numD2);
			} else {
				numOnPoint = barPieceSelected ? 25 : numOnPoint;
				point1 = (numOnPoint - numD1);
				point2 = (numOnPoint - numD2);
				point3 = (numOnPoint - numD1 - numD2);
			}
			point1 = point1 < 0 ? 0 : point1 > 25 ? 25 : point1;
			point2 = point2 < 0 ? 0 : point2 > 25 ? 25 : point2;
			point3 = point3 < 0 ? 0 : point3 > 25 ? 25 : point3;

			//Reset any active points
			resetActive();

			//If the player is the active player and they're either not on the bar or have selected a bar piece
			if (player === activePlayer && (!playerOnBar || barPieceSelected)) {
				//Checks for an available move using the first di and activates the relevant point
				if (dice[0].active && points[point1] && (points[point1].player.id === 0 || points[point1].player === player || points[point1].checkers.length === 1) && ((point1 !== 0 && point1 !== 25) || canGoHome)) {
					canPlay[0] = true;
					hotpoint1 = 't' + point1;
					document.getElementById('t' + point1).setAttribute('activeDice', JSON.stringify([0]));
					document.getElementById('t' + point1).setAttribute("fill", (point1 === 0 || point1 === 25 ? edgeActiveFill : pointActiveFill));
					document.getElementById('t' + point1)
						.addEventListener('click', pointClick);
				}

				//Checks for an available move using the second di and activates the relevant point
				if (dice[1].active && (!dice[0].active || point1 !== point2) && points[point2] && (points[point2].player.id === 0 || points[point2].player === player || points[point2].checkers.length === 1) && ((point2 !== 0 && point2 !== 25) || canGoHome)) {
					canPlay[1] = true;
					hotpoint2 = 't' + point2;
					document.getElementById('t' + point2).setAttribute('activeDice', JSON.stringify([1]));
					document.getElementById('t' + point2)
						.setAttribute("fill", (point2 === 0 || point2 === 25 ? edgeActiveFill : pointActiveFill));
					document.getElementById('t' + point2).addEventListener('click', pointClick);
				}

				//Checks for an available move using both dice and activates the relevant point
				if ((canPlay[0] || canPlay[1]) && dice[0].active && dice[1].active && points[point3] && (points[point3].player.id === 0 || points[point3].player === player || points[point3].checkers.length === 1) && ((point3 !== 0 && point3 !== 25) || canGoHome)) {
					hotpoint3 = 't' + point3;
					document.getElementById('t' + point3).setAttribute('activeDice', JSON.stringify([0,1]));
					document.getElementById('t' + point3)
						.setAttribute("fill", (point3 === 0 || point3 === 25 ? edgeActiveFill : point2MoveActiveFill));
					document.getElementById('t' + point3).addEventListener('click', pointClick);
				}
			}

			//Activates the selected checker if there is a valid move
			if (canPlay[0] || canPlay[1]) {
				activeChecker = checker;
				checker.setAttribute('fill', activeCheckerFill);
			}

			//Flashes the checker if there are no valid moves
			else {
				flashChecker(checker, player);
			}
		}

		//Flashes the checker as it doesn't belong to the player or they are on the bar
		else {
			flashChecker(checker, player);
		}
	} else {
		flashChecker(checker, player);
	}
}

function flashChecker(checker, player) {
	checker.setAttribute('fill', noPlayCheckerFill);
	setTimeout(function () {
		checker.setAttribute('fill', checkerFill[player.id]);
	}, 500);
}

//Reset all active checkers and points
function resetActive() {
	if (activeChecker) {
		activeChecker.setAttribute('fill', checkerFill[activePlayer.id]);
		activeChecker = null;
		resetPoint(document.getElementById(hotpoint1));
		resetPoint(document.getElementById(hotpoint2));
		resetPoint(document.getElementById(hotpoint3));
		hotpoint1 = null;
		hotpoint2 = null;
		hotpoint3 = null;
	}
}

//Resets a single point
function resetPoint(point) {

	//Verify the point is not null
	if (point) {
		point.removeEventListener("click", pointClick);
		var pointN = pointNumber(point);
		if (pointN === 0 || pointN === 25) {
			point.setAttribute("fill", edgeInActiveFill);
		} else if (isEven(pointN)) {
			point.setAttribute("fill", evenPointInactiveFill);
		} else {
			point.setAttribute("fill", oddPointInactiveFill);
		}
	}
}

//Gets the point number value from the point DOM object id
function pointNumber(point) {
	return parseFloat(point.id.split("t")[1]);
}

//Returns true if parameter is even
function isEven(n) {
	return parseFloat(n) % 2 == 0;
}

//Function for when a point is clicked
function pointClick(input) {

	var point = input.target;

	//Moves the checker to its new point
	moveChecker(activeChecker, pointNumber(point), activePlayer);

	//Resets any active hot points
	resetActive();

	JSON.parse(point.getAttribute('activeDice')).forEach(function (diNumber) {
		dice[diNumber].play();
	});

	checkForWin();
	repopulateCheckers(points);

	//Change to alternate player if there are no dice  values left
	if (!dice[0].active && !dice[1].active) {
		changePlayers();
	}
	if (multiplayerGameID) {
		update2PlayerGameData();
	}

	return true;
}

//Removes a checker from an array
function removeCheckerFromArray(inputArray, checker) {
	for (var i = 0; i < inputArray.length; i++) {
		if (inputArray[i] == checker) {
			inputArray.splice(i, 1);
		}
	}
}

function changePlayers() {
	activePlayer = activePlayer === players[1] ? players[2] : players[1];
	diceRolled = false;
	document.getElementById('playerLabel')
		.innerHTML = activePlayer.name;
}

//Moves a checker
function moveChecker(checker, pointNumber, player, clearBoard) {

	//Gets the checker's current point location
	var curPoint = checker.getAttribute('onPoint');

	if (curPoint !== pointNumber) {

		//Only adjust the original point's count and player if the board is not being cleared and the checker is on a current point
		if (!clearBoard && curPoint) {
			removeCheckerFromArray(points[curPoint].checkers, checker);
			if (points[curPoint].checkers.length === 0) {
				points[curPoint].player = players[0];
			}
		}

		//If the new checker is hitting an opponents single checker, send them to the bar
		if (pointNumber != player.barPoint && points[pointNumber].player.id != 0 && points[pointNumber].player != player) {

			//Send opponent checker to bar
			moveChecker(document.querySelector('[onPoint="' + pointNumber + '"]'), 
			player.id === 1 ? players[2].barPoint : players[1].barPoint, points[pointNumber].player.id);
		}

		points[pointNumber].player = player;
		points[pointNumber].checkers.push(checker);
	}
}



//Rolls the dice
function rollDice() {
	var canPlay;

	if (!localPlayer || localPlayer === activePlayer) {
		//Get random numbers for the dice
		dice[0].curValue = Math.floor((Math.random() * 6) + 1);
		dice[1].curValue = Math.floor((Math.random() * 6) + 1);

		resetActive();

		//Verify there is a play with the new dice values
		canPlay = verifyCanPlay();

		//Set dice active and doubles values
		dice[0].double = dice[0].curValue === dice[1].curValue;
		dice[1].double = dice[0].curValue === dice[1].curValue;
		dice[0].active = canPlay;
		dice[1].active = canPlay;

		if (multiplayerGameID) {
			update2PlayerGameData();
		}
	}
}

function verifyCanGoHome(player) {
	//Set points and prerequisites for moves
	if (player.id === 1) {
		return points[19].checkers.length + points[20].checkers.length + points[21].checkers.length + points[22].checkers.length + points[23].checkers.length + points[24].checkers.length + points[25].checkers.length === 15;
	} else {
		return points[0].checkers.length + points[1].checkers.length + points[2].checkers.length + points[3].checkers.length + points[4].checkers.length + points[5].checkers.length + points[6].checkers.length === 15;
	}
}

//Verifies the player has an available move to play
function verifyCanPlay() {
	var result = false;
	var playerOnBar = points[activePlayer.barPoint].checkers.length !== 0;
	var d0Value = dice[0].curValue;
	var d1Value = dice[1].curValue;
	var canGoHome = verifyCanGoHome(activePlayer);



	//If the player is on the bar, they can only play if the point is their own or has 0/1 pieces
	if (playerOnBar) {
		result = ((points[activePlayer.calculatePoint(d0Value)].player === activePlayer || points[activePlayer.calculatePoint(d0Value)].checkers.length <= 1)) || ((points[activePlayer.calculatePoint(d1Value)].player === activePlayer || points[activePlayer.calculatePoint(d1Value)].checkers.length <= 1));
	} else {
		for (var i = 0; i <= 25; i++) {
			if (points[i].player === activePlayer) {
				if (checkForMove(activePlayer, activePlayer === 1 ? i + d0Value : i - d0Value, canGoHome)) {
					return true;
				}
				if (checkForMove(activePlayer, activePlayer === 1 ? i + d1Value : i - d1Value, canGoHome)) {
					return true;
				}
			}
		}
	}

	return result;
}

function checkForMove(player, pointNumber, canGoHome) {
	var point;
	if (25 >= pointNumber >= 0) {
		point = points[pointNumber];
		if (point && (point.player === player || point.player.id === 0)) {
			return true;
		}
	} else if (canGoHome) {
		return true;
	}
	return false;
}

//Collapses the checkers on a point
function adjustCheckers(pointNumber) {
	//Collapse the checkers on the current point if there are more than 5 total
	if (pointNumber !== null && points[pointNumber].checkers.length > 5) {
		//Find all non-collapsed checkers on this point
		document.querySelectorAll('[onPoint="' + pointNumber + '"]:not([collapsed="true"])')
			.forEach(function (checker) {
				//Calculate the new y coordinate of the checker
				var curY = parseFloat(checker.getAttribute('cy'));
				var newY = pointNumber <= 12 ? curY / 2 : ((curY - 570) / 2) + 570;

				//Set the new y coordinate of the checker and it's "collapsed" value to true
				checker.setAttribute('cy', newY);
				checker.setAttribute('collapsed', 'true');
			});
	} else if (pointNumber) {
		//Find all collapsed checkers on this point
		document.querySelectorAll('[onPoint="' + pointNumber + '"][collapsed="true"]')
			.forEach(function (checker) {
				//Calculate the new y coordinate of the checker
				var curY = parseFloat(checker.getAttribute('cy'));
				var newY = pointNumber <= 12 ? curY * 2 : ((curY - 570) * 2) + 570;

				//Set the new y coordinate of the checker and it's "collapsed" value to true
				checker.setAttribute('cy', newY);
				checker.setAttribute('collapsed', 'true');
			});
	}
}

//Find the top checker on the point
function findTopChecker(pointNumber) {
	var selectedChecker;
	//Find all checkers on this point
	document.querySelectorAll('[onPoint="' + pointNumber + '"]')
		.forEach(function (checker) {
			//Update selectedChecker if it is null or the found checker is above the selected checker
			if (!selectedChecker || (pointNumber > 12 ? parseFloat(checker.getAttribute('cy')) < parseFloat(selectedChecker.getAttribute('cy')) : parseFloat(checker.getAttribute('cy')) > parseFloat(selectedChecker.getAttribute('cy')))) {
				selectedChecker = checker;
			}
		});

	return selectedChecker;
}

//Check if the player has won the game
function checkForWin() {
	var wonGame = activePlayer.id === 1 ? points[25].checkers.length === 15 : points[0].checkers.length === 15;
	if (wonGame) {
		document.getElementById('playerLabel')
			.innerHTML = activePlayer.name + ' WON THE GAME!!!';
	}
	return wonGame;
}




//Re-Populates the board from points object
function repopulateCheckers(points) {
	var point;

	for (var pointIndex in points) {
		point = points[pointIndex];

		//Place each checker in their respective location
		placeCheckers(point);

		//Adjust the checkers on the point
		adjustCheckers(point.id);
	}
}

function placeCheckers(point) {
	var res;
	var i = 0;
	point.checkers.forEach(function (checker) {
			//Get the new x y coordinates of the checker
			res = calcCheckerXY(point.id, i);

			//Set the checker x and y coordinates and its new point number
			checker.setAttribute('onPoint', point.id);
			checker.setAttribute('collapsed', false);
			checker.setAttribute('cx', res[0]);
			checker.setAttribute('cy', res[1]);

			i++;
		});
}

//Calculates the new x and y coordinates of where to place a checker on a point
function calcCheckerXY(pointNumber, count) {
	var result = [];

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
	} else if (pointNumber == players[1].barPoint) {
		result[0] = 300;
		result[1] = 550 - (count * 42) + 21;
	} else {
		result[0] = 300;
		result[1] = (count * 42) + 21;
	}

	return result;
}

//Check for enter key pressed in online modal
function onlineModalKeyPress() {
	if (event.keyCode === 13) {
		submitPlayerNames();
	}
}

//Open the modal window to start a 2 player game
function initiateOnlineGame() {
	var modal = document.getElementById('OnlineGameModal');
	modal.style.display = 'block';
}

//Retrieve player names and setup a 2 player game
function submitPlayerNames() {
	var notice;
	var originalColor;
	var modal = document.getElementById('OnlineGameModal');
	players[1].name = document.getElementById('Player1Input')
		.value;
	players[2].name = document.getElementById('Player2Input')
		.value;
	if (players[1].name && players[2].name) {
		modal.style.display = 'none';
		localPlayer = players[1];
		firebaseData = firebase.database();
		get2PlayerGameData(players[1].name, players[2].name);
	} else {
		notice = document.getElementById('OnlineGameModalNotice');
		originalColor = notice.style.color;
		notice.style.color = 'red';
		setTimeout(function () {
			document.getElementById('OnlineGameModalNotice')
				.style.color = originalColor;
		}, 500);
	}
}

//Get unique game id of 2 player game
function get2PlayerGameData(p1Name, p2Name) {
	var gameData;
	var createGame = true;
	var firebaseRef = firebaseData.ref();

	// Get current active games from Firebase
	firebaseRef.child('activeGames')
		.orderByChild('combinedPlayerNames')
		.equalTo(combinePlayerNames(p1Name, p2Name))
		.once('value', function (snapshot) {
			snapshot.forEach(function (activeGame) {
				createGame = false;
				multiplayerGameID = activeGame.key;
				gameData = activeGame.val();
				if (p1Name === gameData.player2) {
					localPlayer = players[2];
					flipBoard();
				}
        else {
          spinBoard(2);
        }
				players[1].name = gameData.player1;
				players[2].name = gameData.player2;
			});
			if (createGame) {
				multiplayerGameID = firebaseRef.child('activeGames')
					.push({
						'activePlayer': activePlayer.toJSON,
						'combinedPlayerNames': combinePlayerNames(p1Name, p2Name),
						'player1': p1Name,
						'player2': p2Name,
						'points': points.map(a => a.toJSON),
						'dice': dice.map(a => a.toJSON)
					})
					.key;
			}
			monitorForOpponentPlay();
		});
}

function update2PlayerGameData() {
	//write the game data to the server
	firebaseData.ref('activeGames/' + multiplayerGameID)
		.set({
			'activePlayer': activePlayer.id,
			'combinedPlayerNames': combinePlayerNames(players[1].name, players[2].name),
			'player1': players[1].name,
			'player2': players[2].name,
			'points': points.map(a => a.toJSON),
			'dice': dice.map(a => a.toJSON)
		});
}

function combinePlayerNames(player1Name, player2Name) {
	players[1].name = player1Name.toString();
	players[2].name = player2Name.toString();
	if (player1Name < player2Name) {
		return player1Name + player2Name;
	}
	return player2Name + player1Name;
}

function monitorForOpponentPlay() {
	var firebaseRef = firebaseData.ref('activeGames')
		.child(multiplayerGameID);
	firebaseRef.on('value', function (snapshot) {
		gameData = snapshot.val();
		points = populateBoardPoints(gameData.points);
		repopulateCheckers(points);
		activePlayer = players[gameData.activePlayer];
		dice[0].curValue = gameData.dice[0].curValue;
		dice[1].curValue = gameData.dice[1].curValue;
		dice[0].double = gameData.dice[0].double;
		dice[1].double = gameData.dice[1].double;
		dice[0].active = gameData.dice[0].active;
		dice[1].active = gameData.dice[1].active;
		dice[0].canPlay = gameData.dice[0].canPlay;
		dice[1].canPlay = gameData.dice[1].canPlay;

		//Set player label to the active player
		document.getElementById('playerLabel')
			.innerHTML = activePlayer.name;
	});
}

function flipBoard() {
	var svgContainer = document.getElementById('svgObj');
	var currentTransform = svgContainer.style.webkitTransform;
	if (currentTransform === '') {
		svgContainer.style.webkitTransform = 'scaleY(-1)';
	} else {
		svgContainer.style.webkitTransform = '';
	}
}

function spinBoard(multiplier) {
	var svgContainer = document.getElementById('svgObj');
	var currentTransform = svgContainer.style.webkitTransform;
	if (multiplier > 0 && currentTransform === '') {
    svgContainer.style.transition = '.5s';
		svgContainer.style.webkitTransform = 'rotate(360deg)';
    setTimeout(function () {
  		svgContainer.style.transition = '0s';
  		svgContainer.style.webkitTransform = '';
      setTimeout(function () {
    		svgContainer.style.transition = '.5s';
        spinBoard(multiplier - 1);
      }, 10);
    }, 1000);
  }
}
