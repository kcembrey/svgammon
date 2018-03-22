/*jshint esversion: 6 */


class boardPlayer {
	constructor(id, barPoint, startingPoint) {
		this.id = id;
		this.name = id.toString();
		this._barPoint = barPoint;
		this._startingPoint = startingPoint;
	}

	set id(value) {
		this._id = value;
	}

	get id() {
		return this._id;
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

	calculatePoint(value) {
		if (this._id === 1) {
			return this._startingPoint + value;
		} else {
			return this._startingPoint - value;
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

class undoData {
  constructor() {
      this._moves = [];
  }

  addMove(checker, di, fromPoint, toPoint) {
    this._moves.push(new moveData(checker, di, fromPoint, toPoint));
  }

  getLastMove(){
    return this._moves[this._moves.length];
  }
}

class moveData {
  constructor(checker, di, fromPoint, toPoint) {
      this._checker = checker;
      this._di = di;
      this._fromPoint = fromPoint;
      this._toPoint = toPoint;
  }

	get checker() {
		return this._checker;
	}

	set checker(value) {
		this._checker = value;
	}

	get di() {
		return this._di;
	}

	set di(value) {
		this._di = value;
	}

	get fromPoint() {
		return this._fromPoint;
	}

	set fromPoint(value) {
		this._fromPoint = value;
	}

	get toPoint() {
		return this._toPoint;
	}

	set toPoint(value) {
		this._toPoint = value;
	}


}
