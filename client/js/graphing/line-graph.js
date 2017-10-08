
class LineGraph {
	constructor (width, height, canvasId, signal) {
		this.width = width;
		this.height = height;
		this.canvasId = canvasId;
		this.signal = signal;

		var data = this.signal.points();

		this.xScale = d3.scaleTime()
			.range([0, width])
			.domain(d3.extent(data, function (d) { return d.x; }));

		this.yScale = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(data, function (d) { return d.y; })]);

		this.yMidpoint = Math.round(this.height / 2);
		this.xMidpoint = Math.round(this.width / 2);
	}

	render () {
		var self = this;
		var points = this.signal.points();
		var canvas = document.getElementById(this.canvasId);
		var ctx = canvas.getContext("2d");
		
		console.time("render");
		ctx.strokeStyle = "#FFAACC";
    ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.moveTo(0, this.yMidpoint);

		console.log("Drawing points: ", points.length);

		_.each(points, function (point) {
			var x = self.xScale(point.x);
			var y = self.yScale(point.y);

			ctx.lineTo(x, y);
		});
		
		ctx.stroke();
		console.timeEnd("render");
	}
}