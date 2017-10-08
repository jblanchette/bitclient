
class Signal {
	constructor (options) {
		this.options = options;
		this.opts();

		this._clamp = null;
		this._points = [];
	}

	opts () {
		var opt = this.options;

		this.xField = _.get(opt, "x") || "T";
		this.yField = _.get(opt, "y") || "C";
		this.color = _.get(opt, "color") || "#FFAACC";

		console.log("Using ", this.yField);
	}

	makePoint (pt) {
		return {
			x: moment(_.get(pt, this.xField)),
			y: _.get(pt, this.yField)
		}
	}

	clamp (range) {
		this._clamp = {
			start: +range.start,
			end: +range.end
		};
	}

	extent (which) {
		return d3.extent(this.points(), function (d) { return _.get(d, which); });
	}

	create (dataPoints) {
		this._points = _.map(dataPoints, _.bind(this.makePoint, this));
	}

	points () {
		var clamp = this._clamp;

		return _.filter(this._points, function (pt) {
			return !clamp || clamp.start <= pt.x && clamp.end >= pt.x;
		});
	}
}