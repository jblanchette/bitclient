
class Signal {
	constructor (options) {
		this._points = [];
	}

	makePoint (pt) {
		var timestamp = moment(_.get(pt, "T"));
		var value = _.get(pt, "C");

		return {
			x: timestamp,
			y: value
		}
	}

	bounds (which) {
		var b = [
			_.minBy(this._points, which)[which],
			_.maxBy(this._points, which)[which]
		];

		return b;
	}

	create (dataPoints) {
		this._points = _.map(dataPoints, this.makePoint);
	}

	points () {
		return this._points;
	}
}