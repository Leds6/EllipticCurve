const POINT_SIZE = 6;

const CURVE_SIZE = 2;
const CURVE_COLOR = '#aaaaaa';

const TRIGGER_CLICK_DISTANCE = Math.pow(POINT_SIZE, 2) * 3;

const COLOR_A = 'blue';
const COLOR_B = 'purple';
const COLOR_C = 'orange';

const LINE_DRAWING_SPEED = 7;

class Canvas {

	constructor(canvas) {

		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.context.font = "15px Arial";
	}

	draw() {
        this.clear();

		/* Points on the curve */
		this.points = [];
		this.selectedPoints = [];

        let that = this;
        this.canvas.addEventListener('click', function(e) {
            var x;
            var y;
            if (e.pageX || e.pageY) {
                x = e.pageX;
                y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;

            that.click(x, y);
        });


	}

	drawGrid(m) {

	    this.moduloField = new ModuloField(parseFloat(m));
        this.cellsByLine = this.moduloField.m;

        this.solutions = [];

        this.cell_width = this.canvas.width / (this.cellsByLine + 2);

        this.context.fillStyle = "gray";
        // Vertical lignes
        for (let i = 0; i < this.cellsByLine; i ++) {
            let x = i * this.cell_width;
            this.context.textAlign="center";
            this.context.fillText(i,x + this.cell_width + 50, this.canvas.height - 10);
            if(!document.querySelector('#displayGrid').checked) {
                this.context.moveTo(this.x_coord(i), 0);
                this.context.lineTo(this.x_coord(i), this.canvas.height - this.cell_width);
            }
        }

        // Horizontal lines
        for (let i = 0; i < this.cellsByLine; i ++) {
			let x = i * this.cell_width;
            this.context.textAlign="center";
            this.context.fillText(i, 20, this.canvas.height - i * this.cell_width - this.cell_width * 2 + 5);
            if(!document.querySelector('#displayGrid').checked) {
                this.context.moveTo(50, x + this.cell_width);
                this.context.lineTo(this.canvas.width, x + this.cell_width);
            }
        }

        this.context.lineWidth=1;
        this.context.strokeStyle = "gray";
        this.context.stroke();
		

        // for(let x = 0; x < this.cellsByLine; x++) {
        //     let ys = this.calc(x);
        //     for(let y_indice = 0; y_indice < ys.length; y_indice++) {
        //
        //         // Add solutions points
        //
        //         this.solutions.push(new Point(x, ys[y_indice]));
        //
        //         this.context.beginPath();
        //         this.context.fillStyle = "green";
        //         this.context.arc(this.x_coord(x), this.y_coord(ys[y_indice]),POINT_SIZE,0,2*Math.PI);
        //         this.context.fillStyle = "green";
        //         this.context.fill();
        //         this.context.fillStyle = "green";
        //
        //         // Draw curve
        //         if(!document.querySelector('#displayCurve').checked) {
        //             let k = Math.pow(ys[y_indice], 2) - Math.pow(x, 3) - this.a * x - this.b;
        //
        //             let f = new Elliptic(this.a, this.b + k);
        //
        //             this.context.beginPath();
        //             let bottom = false;
        //             for(var i = -1; i <= this.cellsByLine + 1; i = i + 0.01) {
        //                 let y = f.calc(i);
        //                 //if(isNaN(y)) this.canvas.context.beginPath();
        //
        //                 if(y > 0 && y <= this.cellsByLine) this.context.lineTo(this.x_coord(i), this.y_coord(y));
        //
        //             }
        //
        //             this.context.lineWidth=CURVE_SIZE;
        //             this.context.strokeStyle = CURVE_COLOR;
        //             this.context.stroke();
        //         }
        //     }
        // }
	}

	drawEllipticCurve(ellipticCurve) {

        this.points = [];
        this.selectedPoints = [];

        for(let x = 0; x < this.cellsByLine; x++) {
            let ys = ellipticCurve.calc(new Scalar(this.moduloField, x));
            for(let y_indice = 0; y_indice < ys.length; y_indice++) {

                let y = ys[y_indice].y.value;

                // Add solutions points
                this.points.push(new Point(new Scalar(this.moduloField, x), new Scalar(this.moduloField, y)));

                this.context.beginPath();
                this.context.fillStyle = "green";
                this.context.arc(this.x_coord(x), this.y_coord(y),POINT_SIZE,0,2*Math.PI);
                this.context.fillStyle = "green";
                this.context.fill();
                this.context.fillStyle = "green";

            }
        }
        console.log(this.points);
    }

    click(x, y) {
        if(this.points.length === 0) return;

        let nearestPoint = this.points[0];
        let bestDistance = Math.pow(x - this.x_coord(this.points[0].x.value), 2) + Math.pow(y - this.y_coord(this.points[0].y.value), 2);

        for(let i = 0; i < this.points.length; i++) {
            let distance = Math.pow(x - this.x_coord(this.points[i].x.value), 2) + Math.pow(y - this.y_coord(this.points[i].y.value), 2);
            if(distance < bestDistance) {
                nearestPoint = this.points[i];
                bestDistance = distance;
            }
        }

        if(bestDistance > TRIGGER_CLICK_DISTANCE) {
            return;
        }

        // We have a point !

        /*
        let found = false;

        for(let i = 0; i < this.selectedPoints.length; i++) {
            if(this.selectedPoints[i].eq(nearestPoint)) {
                this.selectedPoints.splice(i, 1);
                found = true;
                break;
            }
        }

        if(!found) {
            this.selectedPoints.push(nearestPoint);
        }*/

        if(this.selectedPoints.length > 1) {
            this.selectedPoints = [];
        }


        this.selectedPoints.push(nearestPoint);

        console.log(this.selectedPoints);

        
    }

	clear() {
		this.context.beginPath();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.beginPath();
	}

	// Logical to physical coord
	x_coord(x) {
		x *= this.cell_width;
		x += this.cell_width + 50;
		return x;
	}

	// Logical to physical coord
	y_coord(y) {
		y = this.canvas.height - this.cell_width * parseFloat(y) - this.cell_width * 2;
		return y;
	}
}