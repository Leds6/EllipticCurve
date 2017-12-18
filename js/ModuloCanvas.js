const POINT_SIZE = 6;
 
const CURVE_SIZE = 2;
const CURVE_COLOR = '#aaaaaa';

const TRIGGER_CLICK_DISTANCE = Math.pow(POINT_SIZE, 2) * 3;

	    let that = this;
        m.addEventListener('change', function(){
            that.draw();
            that.cellsByLine = parseFloat(this.value);
        });
const COLOR_A = 'blue';
const COLOR_B = 'purple';
const COLOR_C = 'orange';

const LINE_DRAWING_SPEED = 7;

class Canvas {

	constructor(canvas) {
	    this.mode = 'mult'; // mode de calcul
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.context.font = "15px Arial";
		
        let that = this;
		this.n = new Scalar(new ModuloField(10), 1);
        this.canvas.addEventListener('click', function(e) {
            let x;
            let y;
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

	draw() {
        this.clear();

		/* Points on the curve */
		this.points = [];
		this.selectedPoints = [];



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
		this.ellipticCurve = ellipticCurve;
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
        //console.log(nearestPoint);
        this.context.beginPath();
        if(this.selectedPoints.length < 2) {
            this.context.fillStyle = COLOR_A;
            this.context.fillText('A (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')',this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value) - 12);
        } else {
			if (this.mode==='add'){
				this.context.fillStyle = COLOR_B;
				this.context.fillText('B (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')',this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value) - 12);

			}
        }
        this.context.beginPath();
        this.context.arc(this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value),POINT_SIZE,0,2*Math.PI);
        this.context.fill();

		
        this.context.beginPath();

        let info = document.querySelector('#info');
        let content = document.querySelector('#content');

        switch(this.mode) {
            case 'add':
				//console.log("mode add");
                if(this.selectedPoints.length % 2 == 1) {
                    if(this.selectedPoints.length != 0) {
                        this.pointsToAdd = [];
                        //this.drawModulo();
                    }
					console.log('numro1');
                    this.pointsToAdd.push(nearestPoint);
                    info.innerHTML = 'Click on the second point to add.';
                    content.innerHTML = '<span style="color: ' + COLOR_A + ';">A (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')</span> + ';
                    this.context.fillStyle = COLOR_A;
                    //this.context.fillText('A (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')',this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value) - 12);
                } else {
					console.log('numero2');
                    this.pointsToAdd.push(nearestPoint);
                    info.innerHTML = 'Here is your result, click on a point to make another addition.';
                    content.innerHTML += '<span style="color: ' + COLOR_B + ';">B (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')</span> = ';
                    this.context.fillStyle = COLOR_B;
                    //this.context.fillText('B (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')',this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value) + 22);
                }
                this.context.beginPath();
                this.context.arc(this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value),POINT_SIZE,0,2*Math.PI);
                this.context.fill();

                if(this.pointsToAdd.length % 2 == 0) {
                    //this.drawLine();
					let p = new Point(this.pointsToAdd[0].x, this.pointsToAdd[0].y);
					let q = new Point(this.pointsToAdd[1].x, this.pointsToAdd[1].y);
                    let result = this.ellipticCurve.sum(p,q);
					console.log(result);
                    this.context.fillStyle = COLOR_C;
                    content.innerHTML += '<span style="color: ' + COLOR_C + ';">C (' + result.x.value + ', ' + result.y.value + ')</span>';
                    this.context.beginPath();
                    this.context.arc(this.x_coord(result.x.value), this.y_coord(result.y.value),POINT_SIZE,0,2*Math.PI);
                    this.context.fillText('C (' + result.x.value + ', ' + result.y.value + ')',this.x_coord(result.x.value), this.y_coord(result.y.value) + 22);
                    this.context.fill();
                    //console.log(this.sum(this.pointsToAdd[0], this.pointsToAdd[1]));
                }

                break;

            case 'mult':
				
                console.log("mode mult");
				this.aPoint = nearestPoint;
				info.innerHTML = 'Now enter an integer n.';
				content.innerHTML = '<span style="color: ' + COLOR_A + ';">A (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')</span> x ';
				this.context.fillStyle = COLOR_A;
				this.context.fillText('A (' + nearestPoint.x.value + ', ' + nearestPoint.y.value + ')',this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value) - 12);
				
				//console.log(this.n);
				content.innerHTML += '<span style="color: ' + COLOR_B + ';">B (' + this.n.value + ')</span> = ';
				console.log(this.n.value);
				console.log(this.aPoint);
				let result = this.ellipticCurve.mul(this.aPoint, this.n.value );
				console.log(result);
				/*
                this.context.fillStyle = COLOR_C;
                content.innerHTML += '<span style="color: ' + COLOR_C + ';">C (' + result.x.value + ', ' + result.y.value + ')</span>';
                this.context.beginPath();
                this.context.arc(this.x_coord(result.x.value), this.y_coord(result.y.value),POINT_SIZE,0,2*Math.PI);
                this.context.fillText('C (' + result.x.value + ', ' + result.y.value + ')',this.x_coord(result.x.value), this.y_coord(result.y.value) + 22);
                this.context.fill();	                
				
               

                info.innerHTML = 'Here is your result, click on a new point to make another multiplication.';
                content.innerHTML += '<span style="color: ' + COLOR_B + ';">B (' + this.n.value + ')</span> = ';
                this.context.fillStyle = COLOR_B;
				console.log(this.n.value)
                this.context.fillText('B (' + this.n.value + ')',this.n.value);

                this.context.beginPath();
                this.context.arc(this.x_coord(nearestPoint.x.value), this.y_coord(nearestPoint.y.value),POINT_SIZE,0,2*Math.PI);
                this.context.fill();
                let result = this.mult(this.aPoint, this.n.value)
                this.context.fillStyle = COLOR_C;
                content.innerHTML += '<span style="color: ' + COLOR_C + ';">C (' + result.x.value + ', ' + result.y.value + ')</span>';
                this.context.beginPath();
                this.context.arc(this.x_coord(result.x.value), this.y_coord(result.y.value),POINT_SIZE,0,2*Math.PI);
                this.context.fillText('C (' + result.x.value + ', ' + result.y.value + ')',this.x_coord(result.x.value), this.y_coord(result.y.value) + 22);
                this.context.fill();
                //console.log(this.mult(this.aPont, this.n));
*/
                break;
				
			case 'div':
				//console.log("mode div");
				break;
        }


    }
	
	n_valueSet(n){
		this.n = new Scalar(moduloField, parseInt(this.n));
		return this.n;
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