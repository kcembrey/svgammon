var points = [];
var d1Active = false;
var d2Active = false;
var hotpoint1 = 0;
var hotpoint2 = 0;
var element;

function onLoad(populateBoard) {
	//svg.text(10, 20, error || 'Loaded into ' + this.id);
	//resetSize(svg, null, null); //'100%', '100%');
}

function populateBoard() {
  var player = 1;
  var element;
  var checker;
  var res;
  var i;
  var fill;
  var checkers = [];

  for (i = 1; i <= 15; i++) {
    fill = player === 1 ? 'yellow' : 'brown';
    checker = document.createElement('circle');
    checker.setAttribute('id', 'p' + player + 'c' + i);
    checker.setAttribute('r', '20');
    checker.setAttribute('stroke', 'black');
    checker.setAttribute('stroke-width', '1');
    checker.setAttribute('fill', fill);
    document.getElementById('svgObj').appendChild(checker);
    if (player === 1 && i === 15) {
      i = 0;
      player = 2;
    }
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
		document.getElementById(element)
			.setAttribute("points", i * 40 + " 0, " + (i * 40 + 20) + " 230, " + (i * 40 + 40) + " 0");
	}
	for (i = 7; i <= 12; i++) {
		element = "t" + (13 - i);
		document.getElementById(element)
			.setAttribute("points", (i * 40 + 40) + " 0, " + (i * 40 + 60) + " 230, " + (i * 40 + 80) + " 0");
	}
	for (i = 1; i <= 6; i++) {
		element = "t" + (i + 12);
		document.getElementById(element)
			.setAttribute("points", i * 40 + " 590, " + (i * 40 + 20) + " 360, " + (i * 40 + 40) + " 590");
	}
	for (i = 7; i <= 12; i++) {
		element = "t" + (i + 12);
		document.getElementById(element)
			.setAttribute("points", (i * 40 + 40) + " 590, " + (i * 40 + 60) + " 360, " + (i * 40 + 80) + " 590");
	}

	for (i = 1; i <= 2; i++) {
		checker = "p1c" + i;
		res = calcCheckerXY(1, 1);
		moveChecker(checker, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 1);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}
	for (i = 3; i <= 7; i++) {
		checker = "p1c" + i;
		res = calcCheckerXY(12, 1);
		moveChecker("p1c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 12);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}
	for (i = 8; i <= 10; i++) {
		checker = "p1c" + i;
		res = calcCheckerXY(17, 1);
		moveChecker("p1c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 17);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}
	for (i = 11; i <= 15; i++) {
		checker = "p1c" + i;
		res = calcCheckerXY(19, 1);
		moveChecker("p1c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 19);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}


	for (i = 1; i <= 5; i++) {
		checker = "p2c" + i;
		res = calcCheckerXY(5, 2);
		moveChecker("p2c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 6);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}
	for (i = 6; i <= 8; i++) {
		checker = "p2c" + i;
		res = calcCheckerXY(7, 2);
		moveChecker("p2c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 8);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}
	for (i = 9; i <= 13; i++) {
		checker = "p2c" + i;
		res = calcCheckerXY(13, 2);
		moveChecker("p2c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 13);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}
	for (i = 14; i <= 15; i++) {
		checker = "p2c" + i;
		res = calcCheckerXY(24, 2);
		moveChecker("p2c" + i, res[0], res[1]);
		document.getElementById(checker).setAttribute("onPoint", 24);
		$("#" + checker).click(function () {
				$(this)
					.attr("fill", "purple");
				highlightPoints(this);
			});
	}

	hideDice();
}

function highlightPoints(checker) {
	var onPoint = checker.getAttribute("onPoint");
	var d1val = document.getElementById("d1value")
		.value;
	var d2val = document.getElementById("d2value")
		.value;
	var checkerID = checker.id;
	var player = checker.id.split("p")[1].split("c")[0];
	var point1;
	var point2;
	var numOnPoint = parseFloat(onPoint);
	var numD1 = parseFloat(d1val);
	var numD2 = parseFloat(d2val);
	if (player == 1) {
		point1 = "t" + (numOnPoint + numD1);
		point2 = "t" + (numOnPoint + numD2);
	} else {
		point1 = "t" + (numOnPoint - numD1);
		point2 = "t" + (numOnPoint - numD2);
	}
	if (d1Active) {
		$("#" + point1)
			.attr("fill", "green");
		$("#" + point1)
			.click(function () {
				pointClick(checkerID, document.getElementById(point1), "1");
			});
	}
	if (d2Active) {
		$("#" + point2)
			.attr("fill", "green");
		$("#" + point2)
			.click(function () {
				pointClick(checkerID, document.getElementById(point2), "1");
			});
	}
	hotpoint1 = point1;
	hotpoint2 = point2;
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
	var res = calcCheckerXY(pointNumber(point), player);
	moveChecker(checkerID, res[0], res[1]);
	resetPoints();
	if (player == "1") {
		$("#" + checkerID)
			.attr("fill", "yellow");
	} else {
		$("#" + checkerID)
			.attr("fill", "red");
	}
	if (pointNumber(point) == document.getElementById("d1value")
		.value) {
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

function moveChecker(checkerID, x, y) {
	document.getElementById(checkerID)
		.setAttribute("cx", x);
	document.getElementById(checkerID)
		.setAttribute("cy", y);
}

function calcCheckerXY(point, player) {
	var result = [];
	var count = points[point].count;
	if (points[point].player == 0) {
		points[point].player = player;
	}
	if (count <= 1 || points[point].player == player) {
		if (point <= 6) {
			result[0] = 580 - (point * 40);
			result[1] = (count * 42) + 21;
		} else if (point <= 12) {
			result[0] = 540 - (point * 40);
			result[1] = (count * 42) + 21;
		} else if (point <= 18) {
			result[0] = 20 + ((point - 12) * 40);
			result[1] = 550 - (count * 42) + 21;
		} else if (point <= 24) {
			result[0] = 60 + ((point - 12) * 40);
			result[1] = 550 - (count * 42) + 21;
		}
		points[point].count++;
	} else {
		result = false;
	}
	return result;
}

function rollDice() {
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
