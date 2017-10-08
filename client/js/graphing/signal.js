
class Signal {
	constructor (options) {
		this.options = options;
		this.opts();

		this._points = [];
	}

	opts () {
		var opt = this.options;

		this.xField = _.get(opt, "x") || "T";
		this.yField = _.get(opt, "y") || "C";
	}

	makePoint (pt) {
		return {
			x: moment(_.get(pt, this.xField)),
			y: _.get(pt, this.yField)
		}
	}

	extent (which) {
		return d3.extent(this._points, function (d) { return _.get(d, which); });
	}

	create (dataPoints) {
		this._points = _.map(dataPoints, _.bind(this.makePoint, this));
	}

	points () {
		return this._points;
	}
}