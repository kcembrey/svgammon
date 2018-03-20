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
var multiplayerGameID;
var playerCheckerCount = [0, 0, 0];
var dice = [];
var channel;
var firebaseData;
var localPlayer;
var diceRolled = false;
var players;

class boardPlayer {
	constructor(id, barPoint) {
		this.id = id;
		this.name = id.toString();
		this._barPoint = barPoint;
	}

	set id(value) {
		this._value = value;
	}

	get id() {
		return this._value;
	}

	set name(value) {
		this._name = value;
	}

	get name() {
		return this._name;
	}

	get barPoint() {
		return this._barPoint;
	}

	calculatePoint(pointNumber, value) {
		if (this._id === 1) {
			return value;
		} else {
			return pointNumber - value;
		}
	}
}
class boardPoint {
	constructor(id, checkerCount, player) {
		this.id = id;
		this.checkers = initiateCheckers(player, checkerCount);
		this.player = player;
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get checkers() {
		return this._checkers;
	}

	set checkers(value) {
		this._checkers = value;
	}

	get object() {
		return this._object;
	}

	set object(value) {
		this._object = value;
	}

	get dots() {
		return this._dots;
	}

	set dots(value) {
		this._dots = value;
	}

	get player() {
		return this._player;
	}

	set player(value) {
		this._player = value;
	}

	get toJSON() {
		return {
			id: this._id,
			checkers: this._checkers.length,
			player: this._player.id
		};
	}
}

class boardDi {
	constructor(id, object) {
		this.id = id;
		this.object = object;
		this.active = false;
		this.dots = [];
		this.curValue = 0;
		this.canPlay = false;
		this.double = false;
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get curValue() {
		return this._curValue;
	}

	set curValue(value) {
		this._curValue = value;

		//hide all dots on di
		this._dots.forEach(function (dot) {
			dot.style.visibility = 'hidden';
		});

		//show relevant dots from value
		if (value === 1 || value === 3 || value === 5) {
			this._dots[6].style.visibility = 'visible';
		}
		if (value >= 2) {
			this._dots[0].style.visibility = 'visible';
			this._dots[5].style.visibility = 'visible';
		}
		if (value >= 4) {
			this._dots[1].style.visibility = 'visible';
			this._dots[4].style.visibility = 'visible';
		}
		if (value === 6) {
			this._dots[2].style.visibility = 'visible';
			this._dots[3].style.visibility = 'visible';
		}
	}

	get double() {
		return this._double;
	}

	set double(value) {
		this._double = value;
		this._object.style.fill = value ? doubleDiceFill : singleDiceFill;
	}

	get active() {
		return this._active;
	}

	set active(value) {
		this._active = value;
		this._object.style.fill = value ? this._object.style.fill : emptyDiceFill;
	}

	get object() {
		return this._object;
	}

	set object(value) {
		this._object = value;
	}

	get dots() {
		return this._dots;
	}

	set dots(value) {
		this._dots = value;
	}

	get canPlay() {
		return this._canPlay;
	}

	set canPlay(value) {
		this._canPlay = value;
	}

	play() {
		//Updates the specified di fill color and status
		if (this._double) {
			this.double = false;
		} else {
			this.active = false;
		}
	}

	hide() {
		this._object.style.visiblity = 'hidden';
	}

	get toJSON() {
		return {
			id: this._id,
			active: this._active,
			curValue: this._curValue,
			canPlay: this._canPlay,
			double: this._double
		};
	}
}


populateBoard();



//Initiate required board pieces the first time
function initiate() {
	var checker;
	var di = 0;
	var dot;
	var cx;
	var cy;
	var rx;
	var svgns = 'http://www.w3.org/2000/svg';
	var element;

	players = [new boardPlayer(0, 1000), new boardPlayer(1, 27), new boardPlayer(2, 26)];

	//Create Dice SVG objects
	for (i = 0; i <= 6; i++) {
		dx = di === 0 ? (i === 6 ? '130' : (isEven(i) ? '119' : '141')) : (i === 6 ? '190' : (isEven(i) ? '179' : '201'));
		dy = i <= 1 ? 294 : (i <= 3 ? 305 : (i <= 5 ? 316 : 305));

		if (i === 0) {
			rx = di === 0 ? '110' : '170';
			rect = document.createElementNS(svgns, 'rect');
			rect.setAttributeNS(null, 'id', 'd' + di);
			rect.setAttributeNS(null, 'stroke', 'black');
			rect.setAttributeNS(null, 'stroke-width', '1');
			rect.setAttributeNS(null, 'width', '40');
			rect.setAttributeNS(null, 'height', '40');
			rect.setAttributeNS(null, 'x', rx);
			rect.setAttributeNS(null, 'y', '285');
			document.getElementById('svgObj')
				.appendChild(rect);
			dice[di] = new boardDi(di, rect);
		}
		dot = document.createElementNS(svgns, 'circle');
		dot.setAttributeNS(null, 'id', 'd' + di + 'd' + i);
		dot.setAttributeNS(null, 'r', '4');
		dot.setAttributeNS(null, 'stroke', 'black');
		dot.setAttributeNS(null, 'stroke-width', '1');
		dot.setAttributeNS(null, 'fill', diceDotFill);
		dot.setAttributeNS(null, 'cx', dx);
		dot.setAttributeNS(null, 'cy', dy);
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
			player = players[1];
			checkers = 2;
			break;
		case 6:
		case 13:
			player = players[2];
			checkers = 5;
			break;
		case 8:
			player = players[2];
			checkers = 3;
			break;
		case 12:
		case 19:
			player = players[1];
			checkers = 5;
			break;
		case 17:
			player = players[1];
			checkers = 3;
			break;
		case 24:
			player = players[2];
			checkers = 2;
			break;
		default:
			player = players[0];
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
			player: players[0]
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
		result[pointData[key].id] = (new boardPoint(pointData[key].id, pointData[key].checkers, pointData[key].player));
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
			checker.setAttributeNS(null, 'id', 'p' + player.id + 'c' + playerCheckerCount[player.id]);
			checker.setAttributeNS(null, 'r', '20');
			checker.setAttributeNS(null, 'stroke', 'black');
			checker.setAttributeNS(null, 'stroke-width', '1');
			checker.setAttributeNS(null, 'fill', checkerFill[player.id]);
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
function checkerClick() {
	var point1;
	var point2;
	var point3;
	var checker = this;
	var onPoint = checker.attributes.onPoint.value;
	var checkerID = checker.id;
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
			pointClick(activeChecker.id, document.getElementById('t' + numOnPoint), player);
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
					$('#t' + point1)
						.attr("fill", (point1 === 0 || point1 === 25 ? edgeActiveFill : pointActiveFill));
					$('#t' + point1)
						.click(function () {
							pointClick(checkerID, document.getElementById('t' + point1), player, [dice[0]]);
						});
				}

				//Checks for an available move using the second di and activates the relevant point
				if (dice[1].active && (!dice[0].active || point1 !== point2) && points[point2] && (points[point2].player.id === 0 || points[point2].player === player || points[point2].checkers.length === 1) && ((point2 !== 0 && point2 !== 25) || canGoHome)) {
					canPlay[1] = true;
					hotpoint2 = 't' + point2;
					$('#t' + point2)
						.attr("fill", (point2 === 0 || point2 === 25 ? edgeActiveFill : pointActiveFill));
					$('#t' + point2)
						.click(function () {
							pointClick(checkerID, document.getElementById('t' + point2), player, [dice[1]]);
						});
				}

				//Checks for an available move using both dice and activates the relevant point
				if ((canPlay[0] || canPlay[1]) && dice[0].active && dice[1].active && points[point3] && (points[point3].player.id === 0 || points[point3].player === player || points[point3].checkers.length === 1) && ((point3 !== 0 && point3 !== 25) || canGoHome)) {
					hotpoint3 = 't' + point3;
					$('#t' + point3)
						.attr("fill", (point3 === 0 || point3 === 25 ? edgeActiveFill : point2MoveActiveFill));
					$('#t' + point3)
						.click(function () {
							pointClick(checkerID, document.getElementById('t' + point3), player, [dice[0], dice[1]]);
						});
				}
			}

			//Activates the selected checker if there is a valid move
			if (canPlay[0] || canPlay[1]) {
				activeChecker = checker;
				$(checker)
					.attr('fill', activeCheckerFill);
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
	$(checker)
		.attr('fill', noPlayCheckerFill);
	setTimeout(function () {
		$(checker)
			.attr('fill', checkerFill[player.id]);
	}, 500);
}

//Reset all active checkers and points
function resetActive() {
	if (activeChecker) {
		$(activeChecker)
			.attr('fill', checkerFill[activePlayer.id]);
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
	if (point) {
		$(point)
			.unbind("click");
		var pointN = pointNumber(point);
		if (pointN === 0 || pointN === 25) {
			$(point)
				.attr("fill", edgeInActiveFill);
		} else if (isEven(pointN)) {
			$(point)
				.attr("fill", evenPointInactiveFill);
		} else {
			$(point)
				.attr("fill", oddPointInactiveFill);
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
function pointClick(checkerID, point, player, diceUsed) {
	var checkerPoint = document.getElementById(checkerID)
		.getAttribute('onPoint');

	//Moves the checker to its new point
	moveChecker(checkerID, pointNumber(point), player);

	//Resets any active hot points
	resetActive();

	//Gets the distance between the checker point and the new point
	var distance = Math.abs(checkerPoint - pointNumber(point));

	diceUsed.forEach(function (di) {
		di.play();
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

//Moves a checker without specifying a clear board
function moveChecker(checkerID, pointNumber, player) {
	moveChecker(checkerID, pointNumber, player, false);
}

//Moves a checker
function moveChecker(checkerID, pointNumber, player, clearBoard) {

	//Gets the checker's current point location
	var curChecker = document.getElementById(checkerID);
	var curPoint = curChecker.getAttribute('onPoint');

	if (curPoint !== pointNumber) {

		//Only adjust the original point's count and player if the board is not being cleared and the checker is on a current point
		if (!clearBoard && curPoint) {
			removeCheckerFromArray(points[curPoint].checkers, curChecker);
			if (points[curPoint].checkers.length === 0) {
				points[curPoint].player.id = 0;
			}
		}

		//If the new checker is hitting an opponents single checker, send them to the bar
		if (pointNumber != player.barPoint && points[pointNumber].player.id != 0 && points[pointNumber].player != player) {

			//Send opponent checker to bar
			moveChecker($('[onPoint=' + pointNumber + ']')
				.attr('id'), player.id === 1 ? players[2].barPoint : players[1].barPoint, points[pointNumber].player.id);
		}

		points[pointNumber].player = player;
		points[pointNumber].checkers.push(curChecker);
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
	var homeOffset = activePlayer.id === 2 ? 25 : 0;
	var canGoHome = verifyCanGoHome(activePlayer);



	//If the player is on the bar, they can only play if the point is their own or has 0/1 pieces
	if (playerOnBar) {
		result = ((points[d0Value - homeOffset].player === activePlayer || points[d0Value - homeOffset].checkers.length <= 1)) || ((points[d1Value - homeOffset].player === activePlayer || points[d1Value - homeOffset].checkers.length <= 1));
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
		$("[onPoint=" + pointNumber + "][collapsed!='true']")
			.each(function () {
				//Calculate the new y coordinate of the checker
				var curY = parseFloat($(this)
					.attr('cy'));
				var newY = pointNumber <= 12 ? curY / 2 : ((curY - 570) / 2) + 570;

				//Set the new y coordinate of the checker and it's "collapsed" value to true
				$(this)
					.attr('cy', newY);
				$(this)
					.attr('collapsed', 'true');
			});
	} else if (pointNumber) {
		//Find all collapsed checkers on this point
		$("[onPoint=" + pointNumber + "][collapsed='true']")
			.each(function () {
				//Calculate the new y coordinate of the checker
				var curY = parseFloat($(this)
					.attr('cy'));
				var newY = pointNumber <= 12 ? curY * 2 : ((curY - 570) * 2) + 570;

				//Set the new y coordinate of the checker and it's "collapsed" value to true
				$(this)
					.attr('cy', newY);
				$(this)
					.attr('collapsed', 'true');
			});
	}
}

//Find the top checker on the point
function findTopChecker(pointNumber) {
	var selectedChecker;
	//Find all checkers on this point
	$("[onPoint=" + pointNumber + "]")
		.each(function () {
			//Update selectedChecker if it is null or the found checker is above the selected checker
			if (!selectedChecker || (pointNumber > 12 ? parseFloat($(this)
					.attr('cy')) < parseFloat($(selectedChecker)
					.attr('cy')) : parseFloat($(this)
					.attr('cy')) > parseFloat($(selectedChecker)
					.attr('cy')))) {
				selectedChecker = this;
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
	$(point.checkers)
		.each(function () {
			//Get the new x y coordinates of the checker
			res = calcCheckerXY(point.id, i);

			//Set the checker x and y coordinates and its new point number
			$(this)
				.attr('onPoint', point.id);
			$(this)
				.attr('collapsed', false);
			$(this)
				.attr('cx', res[0]);
			$(this)
				.attr('cy', res[1]);

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
			'activePlayer': activePlayer.toJSON,
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
		activePlayer = gameData.activePlayer;
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
