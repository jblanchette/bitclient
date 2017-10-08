
class LineGraph {
	constructor (width, height, canvasId, signals) {
		this.width = width;
		this.height = height;
		this.canvasId = canvasId;
		this.signals = signals;

		var focusSignalExtent = _.first(signals).extent("x");
		this.focusRange = {
			start: focusSignalExtent[0],
			end: focusSignalExtent[1]
		};

		this.xScale = d3.scaleTime()
			.range([0, width]);

		this.yScale = d3.scaleLinear()
			.range([height, 0]);

		this.yMidpoint = Math.round(this.height / 2);
		this.xMidpoint = Math.round(this.width / 2);
	}

	setFocusRange (range) {
		this.focusRange = range;

		_.each(this.signals, function (signal) {
			signal.clamp(range);
		});
	}

	getFocusRange () {
		var localFormat = "YYYY-MM-DDThh:mm:ss.SSS";

		return {
			start: this.focusRange.start.format(localFormat),
			end: this.focusRange.end.format(localFormat)
		};
	}

	renderGrid (ctx) {
		ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(0, this.yMidpoint);
		ctx.lineTo(this.width, this.yMidpoint);
		ctx.stroke();
	}

	renderSignal (ctx, signal) {
		var self = this;
		var data = signal.points();
		
		this.xScale
			.domain(signal.extent("x"));

		this.yScale
			.domain([0, d3.max(data, function (d) { return d.y; })]);

		ctx.strokeStyle = signal.color;
    ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.moveTo(0, this.yMidpoint);

		_.each(data, function (point) {
			var x = self.xScale(point.x);
			var y = self.yScale(point.y) + self.yMidpoint;

			ctx.lineTo(x, y);
		});
		
		ctx.stroke();
	}

	render () {
		console.time("render");
		///
		var self = this;
		var canvas = document.getElementById(this.canvasId);
		var ctx = canvas.getContext("2d");

		// clear canvas
		ctx.clearRect(0, 0, this.width, this.height);
		// render grid
		this.renderGrid(ctx);
		// render signals
		_.each(this.signals, function (signal) {
			self.renderSignal(ctx, signal);
		});
		
		///
		console.timeEnd("render");
	}
}