var points = [];
var diceActive = [false, false];
var diceDoubles = [false, false];
var doubleDiceFill = 'orangered';
var singleDiceFill = 'orange';
var emptyDiceFill = 'white';
var hotpoint1 = 0;
var hotpoint2 = 0;
var element;
var initiated = false;
var p1CheckerFill = 'yellow';
var p2CheckerFill = 'brown';
var activeCheckerFill = 'purple';
var noPlayCheckerFill = 'maroon';
var pointActiveFill = 'green';
var edgeActiveFill = 'orange';
var edgeInActiveFill = 'blue';
var evenPointInactiveFill = 'black';
var oddPointInactiveFill = 'red';
var activeChecker;
var activePlayer = 1;

function onLoad(populateBoard) {
	//svg.text(10, 20, error || 'Loaded into ' + this.id);
	//resetSize(svg, null, null); //'100%', '100%');
}

function initiate(){
  var checker;
  var di = 0;
  var dot;
  var player = 1;
  var cx;
  var cy;
  var rx;
  var svgns = 'http://www.w3.org/2000/svg';

  for (i = 1; i <= 15; i++) {
    fill = player === 1 ? p1CheckerFill : p2CheckerFill;
    checker = document.createElementNS(svgns, 'circle');
    checker.setAttributeNS(null, 'id', 'p' + player + 'c' + i);
    checker.setAttributeNS(null, 'r', '20');
    checker.setAttributeNS(null, 'stroke', 'black');
    checker.setAttributeNS(null, 'stroke-width', '1');
    checker.setAttributeNS(null, 'fill', fill);
    document.getElementById('svgObj').appendChild(checker);
    if (player === 1 && i === 15) {
      i = 0;
      player = 2;
    }
  }

  for (i = 1; i <= 7; i++) {
    dx = di === 0 ? (i === 7 ? '130' : (isEven(i)  ? '141' : '119') ) : (i === 7 ? '190' : (isEven(i)  ? '201' : '179') );
    dy = i <= 2 ? 294 : ( i <= 4 ? 305 : ( i <= 6 ? 316 : 305));

    if (i === 1){
      rx = di === 0 ? '110' : '170';
      rect = document.createElementNS(svgns, 'rect');
      rect.setAttributeNS(null, 'id', 'd' + di);
      rect.setAttributeNS(null, 'stroke', 'black');
      rect.setAttributeNS(null, 'stroke-width', '1');
      rect.setAttributeNS(null, 'fill', 'orange');
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
    dot.setAttributeNS(null, 'fill', 'black');
    dot.setAttributeNS(null, 'cx', dx);
    dot.setAttributeNS(null, 'cy', dy);
    document.getElementById('svgObj').appendChild(dot);

    if (di === 0 && i === 7) {
      i = 0;
      di = 1;
    }
  }

  document.getElementById('playerLabel').innerHTML = activePlayer;
  initiated = true;
}

function populateBoard() {
  var player;
  var element;
  var checker;
  var res;
  var i;
  var fill;
  var checkers = [];

  if (!initiated) {
    initiate();
  }

  //Populate points list
	for (i = 0; i <= 25; i++) {
		points[i] = {
			id: i,
			count: 0,
			player: 0
		};
	}

  //Populate bar points
  for (i = 100; i <= 200; i+= 100) {
    points[i] = {
      id: i,
      count: 0,
      player: 0
    };
  }

	for (i = 1; i <= 6; i++) {
		element = "t" + (13 - i);
		document.getElementById("t" + (13 - i))
			.setAttribute("points", i * 40 + " 0, " + (i * 40 + 20) + " 230, " + (i * 40 + 40) + " 0");
	}
	for (i = 7; i <= 12; i++) {
		element = "t" + (13 - i);
		document.getElementById("t" + (13 - i))
			.setAttribute("points", (i * 40 + 40) + " 0, " + (i * 40 + 60) + " 230, " + (i * 40 + 80) + " 0");
	}
	for (i = 1; i <= 6; i++) {
		element = "t" + (i + 12);
		document.getElementById("t" + (i + 12))
			.setAttribute("points", i * 40 + " 590, " + (i * 40 + 20) + " 360, " + (i * 40 + 40) + " 590");
	}
	for (i = 7; i <= 12; i++) {
		element = "t" + (i + 12);
		document.getElementById("t" + (i + 12))
			.setAttribute("points", (i * 40 + 40) + " 590, " + (i * 40 + 60) + " 360, " + (i * 40 + 80) + " 590");
	}

	for (i = 1; i <= 2; i++) {
    initiateChecker(1, i, 1);
	}
	for (i = 3; i <= 7; i++) {
    initiateChecker(1, i, 12);
	}
	for (i = 8; i <= 10; i++) {
    initiateChecker(1, i, 17);
	}
	for (i = 11; i <= 15; i++) {
    initiateChecker(1, i, 19);
	}


	for (i = 1; i <= 5; i++) {
    initiateChecker(2, i, 5);
	}
	for (i = 6; i <= 8; i++) {
    initiateChecker(2, i, 7);
	}
	for (i = 9; i <= 13; i++) {
    initiateChecker(2, i, 13);
	}
	for (i = 14; i <= 15; i++) {
    initiateChecker(2, i, 24);
	}

	hideDice();
}

function initiateChecker(player, checkerIndex, point){
  checker = 'p' + player + 'c' + checkerIndex;
  moveChecker( checker, point, player);
  $("#" + checker).click(function () {
      highlightPoints(this);
    });
}


function highlightPoints(checker) {
	var onPoint = checker.getAttribute("onPoint");
	var d1Val = document.getElementById("d1value").value;
	var d2Val = document.getElementById("d2value").value;
	var checkerID = checker.id;
	var player = parseFloat(checker.id.split("p")[1].split("c")[0]);
	var point1;
	var point2;
	var numOnPoint = parseFloat(onPoint);
	var numD1 = parseFloat(d1Val);
	var numD2 = parseFloat(d2Val);
  var playerOnBar = player === 1 ? points[100].count !== 0 : points[200].count !== 0;
  var barPieceSelected = false;
  var canPlay = false;

	if (player == 1) {
    barPieceSelected = numOnPoint === 100;
    numOnPoint = barPieceSelected ? 0 : numOnPoint;
		point1 = (numOnPoint + numD1);
		point2 = (numOnPoint + numD2);
	} else {
    barPieceSelected = numOnPoint === 200;
    numOnPoint = barPieceSelected ? 25 : numOnPoint;
		point1 = (numOnPoint - numD1);
		point2 = (numOnPoint - numD2);
	}

  resetActive();
  activeChecker = checker;
  if ( player === activePlayer && (!playerOnBar || barPieceSelected ))
  {
  	if (diceActive[0] && points[point1] && (points[point1].player === 0 || points[point1].player === player || points[point1].count === 1)) {
      canPlay = true;
  		$('#t' + point1).attr("fill", (point1 === 0 || point1 === 25 ? edgeActiveFill : pointActiveFill));
  		$('#t' + point1).click(function () {
  				pointClick(checkerID, document.getElementById('t' + point1), player);
  			});
  	}

  	if (diceActive[1] && (!diceActive[0] || point1 !== point2) && points[point2] && (points[point2].player === 0 || points[point2].player === player || points[point2].count === 1)) {
      canPlay = true;
  		$('#t' + point2).attr("fill", (point2 === 0 || point2 === 25 ? edgeActiveFill : pointActiveFill));
  		$('#t' + point2).click(function () {
  				pointClick(checkerID, document.getElementById('t' + point2), player);
  			});
  	}
  }

  if (canPlay) {
    $(checker).attr('fill', activeCheckerFill);
  }
  else {
      $(checker).attr('fill', noPlayCheckerFill);
      setTimeout(function(){
        $(checker).attr('fill', player === 1 ? p1CheckerFill : p2CheckerFill);
      }, 500);
  }

  hotpoint1 = 't' + point1;
  hotpoint2 = 't' + point2;
}

function resetActive() {
  if (activeChecker) {
    var activeCheckerPlayer = activeChecker.id.split("p")[1].split("c")[0];
    $(activeChecker).attr('fill', activeCheckerPlayer == 1 ? p1CheckerFill : p2CheckerFill);
    resetPoints();
  }
}

function resetPoints() {
	resetPoint(document.getElementById(hotpoint1));
	resetPoint(document.getElementById(hotpoint2));
}

function resetPoint(point) {
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

function pointNumber(point) {
	return parseFloat(point.id.split("t")[1]);
}

function isEven(n) {
	return isNumber(n) && (n % 2 == 0);
}

function isNumber(n) {
	return n == parseFloat(n);
}

function pointClick(checkerID, point, player) {
  var checkerPoint = document.getElementById(checkerID).getAttribute('onPoint');
	var res = moveChecker(checkerID, pointNumber(point), player);
	resetPoints();
	if (player == "1") {
		$("#" + checkerID)
			.attr("fill", p1CheckerFill);
	} else {
		$("#" + checkerID)
			.attr("fill", p2CheckerFill);
	}
  var distance = Math.abs(checkerPoint - pointNumber(point));
	if (diceActive[0] && document.getElementById("d1value").value == distance) {
    updateDi(0);
	} else {
    updateDi(1);
	}

  if (!diceActive[0] && !diceActive[1]){
    activePlayer = activePlayer === 1 ? 2 : 1;
    document.getElementById('playerLabel').innerHTML = activePlayer;
  }

	return true;
}

function moveChecker(checkerID, pointNumber, player) {
  var curPoint = document.getElementById(checkerID).getAttribute('onPoint');
  if (curPoint) {
      points[curPoint].count--;
    if (points[curPoint].count === 0) {
      points[curPoint].player = 0;
    }
  }
  res = calcCheckerXY(pointNumber, player);
  document.getElementById(checkerID).setAttribute("onPoint", pointNumber);
	document.getElementById(checkerID).setAttribute("cx", res[0]);
	document.getElementById(checkerID).setAttribute("cy", res[1]);
}

function calcCheckerXY(pointNumber, player) {
	var result = [];
	var count;

  if (pointNumber != 100 && pointNumber != 200 && points[pointNumber].player != 0 && points[pointNumber].player != player) {
    //Send opponent to bar
    moveChecker($('[onPoint=' + pointNumber +']').attr('id'), player == 2 ? 100 : 200, points[pointNumber].player);
  }

  points[pointNumber].player = player;
  count = points[pointNumber].count;

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
	} else if (pointNumber == 100)  {
    result[0] = 300;
    result[1] = 550 - (count * 42) + 21;
  } else {
		result[0] = 300;
		result[1] = (count * 42) + 21;
	}
	points[pointNumber].count++;

	return result;
}

function rollDice() {
  resetActive();
	clearDice();
	var value1 = Math.floor((Math.random() * 6) + 1);
	var value2 = Math.floor((Math.random() * 6) + 1);
	document.getElementById("d1value").value = value1;
	document.getElementById("d2value").value = value2;
	showDice(value1 === value2);
	populateDi(0, value1);
	populateDi(1, value2);
	diceActive[0] = true;
	diceActive[1] = true;
}

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

function hideDice() {
	$("#d0").css("visibility", "hidden");
	$("#d1").css("visibility", "hidden");
	clearDice();
}

function clearDice() {
	for (i = 1; i <= 7; i++) {
		$("#d0d" + i).css("visibility", "hidden");
		$("#d1d" + i).css("visibility", "hidden");
	}
}

function updateDi(diNumber){
  if (diceDoubles[diNumber]) {
    diceDoubles[diNumber] = false;
    $('#d' + diNumber).css('fill', singleDiceFill);
  }
  else {
    diceActive[diNumber] = false;
    $('#d' + diNumber).css('fill', emptyDiceFill);
  }
}

function showDice(doubles) {
  diceDoubles = [doubles,doubles];
  $("#d0").css('fill', doubles ? doubleDiceFill : singleDiceFill);
	$("#d0").css("visibility", "visible");
  $("#d1").css('fill', doubles ? doubleDiceFill : singleDiceFill);
	$("#d1").css("visibility", "visible");
}
