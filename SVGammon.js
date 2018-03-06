var points = [];
var d1Active = false;
var d2Active = false;
var hotpoint1 = 0;
var hotpoint2 = 0;
var element;
var initiated = false;
var p1CheckerFill = 'yellow';
var p2CheckerFill = 'brown';
var pointActiveFill = 'green';
var activeChecker;

function onLoad(populateBoard) {
	//svg.text(10, 20, error || 'Loaded into ' + this.id);
	//resetSize(svg, null, null); //'100%', '100%');
}

function initiate(){
  var checker;
  var di = 1;
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
    dx = di === 1 ? (i === 7 ? '130' : (isEven(i)  ? '141' : '119') ) : (i === 7 ? '190' : (isEven(i)  ? '201' : '179') );
    dy = i <= 2 ? 294 : ( i <= 4 ? 305 : ( i <= 6 ? 316 : 305));

    if (i === 1){
      rx = di === 1 ? '110' : '170';
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

    if (di === 1 && i === 7) {
      i = 0;
      di = 2;
    }
  }

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

	for (i = 1; i <= 24; i++) {
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
    initiateChecker(1, i, 1, 1);
	}
	for (i = 3; i <= 7; i++) {
    initiateChecker(1, i, 12, 1);
	}
	for (i = 8; i <= 10; i++) {
    initiateChecker(1, i, 17, 1);
	}
	for (i = 11; i <= 15; i++) {
    initiateChecker(1, i, 19, 1);
	}


	for (i = 1; i <= 5; i++) {
    initiateChecker(2, i, 5, 2);
	}
	for (i = 6; i <= 8; i++) {
    initiateChecker(2, i, 7, 2);
	}
	for (i = 9; i <= 13; i++) {
    initiateChecker(2, i, 13, 2);
	}
	for (i = 14; i <= 15; i++) {
    initiateChecker(2, i, 24, 2);
	}

	hideDice();
}

function initiateChecker(player, checkerIndex, checkerX, checkerY){
  checker = 'p' + player + 'c' + checkerIndex;
  moveChecker( checker, checkerX, player);
  $("#" + checker).click(function () {
      highlightPoints(this);
    });
}


function highlightPoints(checker) {
	var onPoint = checker.getAttribute("onPoint");
	var d1Val = document.getElementById("d1value")
		.value;
	var d2Val = document.getElementById("d2value")
		.value;
	var checkerID = checker.id;
	var player = checker.id.split("p")[1].split("c")[0];
	var point1;
	var point2;
	var numOnPoint = parseFloat(onPoint);
	var numD1 = parseFloat(d1Val);
	var numD2 = parseFloat(d2Val);

	if (player == 1) {
		point1 = (numOnPoint + numD1);
		point2 = (numOnPoint + numD2);
	} else {
		point1 = (numOnPoint - numD1);
		point2 = (numOnPoint - numD2);
	}

  resetActive();

  activeChecker = checker;
  $(checker).attr('fill', 'purple');

console.log(point1);
console.log(point2);
	if (d1Active && (points[point1].player === 0 || points[point1].player === player)) {
		$('#t' + point1)
			.attr("fill", pointActiveFill);
		$('#t' + point1)
			.click(function () {
				pointClick(checkerID, document.getElementById('t' + point1), player);
			});
	}

	if (d2Active && (!d1Active || point1 !== point2) && (points[point2].player === 0 || points[point2].player === player)) {
		$('#t' + point2)
			.attr("fill", pointActiveFill);
		$('#t' + point2)
			.click(function () {
				pointClick(checkerID, document.getElementById('t' + point2), player);
			});
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

function resetPoint(point) {
	$(point)
		.unbind("click");
	if (isEven(pointNumber(point))) {
		$(point)
			.attr("fill", "black");
	} else {
		$(point)
			.attr("fill", "red");
	}
}

function resetPoints() {
	resetPoint(document.getElementById(hotpoint1));
	resetPoint(document.getElementById(hotpoint2));
}

function pointNumber(point) {
	return point.id.split("t")[1];
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
  console.log(distance);
  console.log(document.getElementById("d1value").value);
	if (d1Active && document.getElementById("d1value").value == distance) {
		d1Active = false;
		$("#d1")
			.css("visibility", "hidden");
	} else {
		d2Active = false;
		$("#d2")
			.css("visibility", "hidden");
	}

	return true;
}

function moveChecker(checkerID, pointNumber, player) {

  res = calcCheckerXY(pointNumber, player);
  document.getElementById(checkerID).setAttribute("onPoint", pointNumber);
	document.getElementById(checkerID)
		.setAttribute("cx", res[0]);
	document.getElementById(checkerID)
		.setAttribute("cy", res[1]);
}

function calcCheckerXY(pointNumber, player) {
	var result = [];
	var count = points[pointNumber].count;
	if (points[pointNumber].player == 0) {
		points[pointNumber].player = player;
	}
	if (count <= 1 || points[pointNumber].player == player) {
		if (pointNumber <= 6) {
			result[0] = 580 - (pointNumber * 40);
			result[1] = (count * 42) + 21;
		} else if (pointNumber <= 12) {
			result[0] = 540 - (pointNumber * 40);
			result[1] = (count * 42) + 21;
		} else if (pointNumber <= 18) {
			result[0] = 20 + ((pointNumber - 12) * 40);
			result[1] = 550 - (count * 42) + 21;
		} else if (pointNumber <= 24) {
			result[0] = 60 + ((pointNumber - 12) * 40);
			result[1] = 550 - (count * 42) + 21;
		}
		points[pointNumber].count++;
	} else {
		result = false;
	}
	return result;
}

function rollDice() {
  resetActive();
	showDice();
	clearDice();
	var value1 = Math.floor((Math.random() * 6) + 1);
	var value2 = Math.floor((Math.random() * 6) + 1);
	document.getElementById("d1value")
		.value = value1;
	document.getElementById("d2value")
		.value = value2;
	populateDi(1, value1);
	populateDi(2, value2);
	d1Active = true;
	d2Active = true;
}

function populateDi(di, number) {
	if (number == 1 || number == 3 || number == 5) {
		$("#d" + di + "d7")
			.css("visibility", "visible");
	}
	if (number >= 2) {
		$("#d" + di + "d1")
			.css("visibility", "visible");
		$("#d" + di + "d6")
			.css("visibility", "visible");
	}
	if (number >= 4) {
		$("#d" + di + "d2")
			.css("visibility", "visible");
		$("#d" + di + "d5")
			.css("visibility", "visible");
	}
	if (number == 6) {
		$("#d" + di + "d3")
			.css("visibility", "visible");
		$("#d" + di + "d4")
			.css("visibility", "visible");
	}
}

function hideDice() {
	$("#d1")
		.css("visibility", "hidden");
	$("#d2")
		.css("visibility", "hidden");
	clearDice();
}

function clearDice() {
	for (i = 1; i <= 7; i++) {
		$("#d1d" + i)
			.css("visibility", "hidden");
		$("#d2d" + i)
			.css("visibility", "hidden");
	}
}

function showDice() {
	$("#d1")
		.css("visibility", "visible");
	$("#d2")
		.css("visibility", "visible");
}
