
class Signal {
	constructor (options) {
		this._points = [];
	}

	makePoint (timestamp, value) {
		return {
			dt: timestamp,
			v: value
		}
	}

	create (dataPoints) {
		this._points = _.map(this.makePoint, dataPoints);
	}

	points () {
		return this._points;
	}
}