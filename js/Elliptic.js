const POINT_SIZE = 6;

const CURVE_SIZE = 2;
const CURVE_COLOR = '#aaaaaa'

const TRIGGER_CLICK_DISTANCE = Math.pow(POINT_SIZE, 2) * 3;

const COLOR_A = 'blue';
const COLOR_B = 'purple';
const COLOR_C = 'orange';

const LINE_DRAWING_SPEED = 7

class Elliptic {

	constructor(a, b, m = null, canvas = null) {
		this.a = parseFloat(a);
		this.b = parseFloat(b);
		if(m != null) this.m = parseFloat(m);
		if(canvas != null) {
			this.canvas = new Canvas(canvas, this.m);
			this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		this.mode = 'add';

		this.pointsToAdd = [];

	}

	calc(x) {
		if(this.m != null) {

			if(x >= this.m ) {
				throw new Exception('x(' + x + ') can\'t be greater than m(' + this.m + ')');
			}


			var results = []
			var result = (parseFloat(Math.pow(x, 3)) + parseFloat(this.a * x) + parseFloat(this.b)) % this.m;
			for(var i = 0; i < this.m; i++) {
				if(Math.pow(i, 2) % this.m == result) {

					results.push(i);
				}
			}
			return results;
		}

		let square = parseFloat(Math.pow(x, 3)) + parseFloat(this.a * x) + parseFloat(this.b);
		if(square < 0) square = 0;
		return Math.sqrt(square);
	}

	sum(p1, p2) {

		// If same point
		if(p1.x == p2.x && p1.y == p2.y) {

			if(p1.y == 0) throw new Exception('Infinity');


			if(this.m != null) {
				var m = (3 * Math.pow(p1.x, 2) + this.a ) * this.inverseOf( 2 * p1.y );
			} else {
				var m = (3 * Math.pow(p1.x, 2) + this.a) / (2 * p1.y);
			}

		} else {
			
			if(this.m != null)  {
				var m  = (p2.y - p1.y) * this.inverseOf(p2.x - p1.x);
			} else {
				var m = (p2.y - p1.y) / (p2.x - p1.x);
			}
		}

		var x3 = Math.pow(m, 2) - p1.x - p2.x;
		var y3 = m * (p1.x - x3) - p1.y;

		if(this.m != null) {
			x3 %= this.m;
			if(x3 < 0) x3 += this.m
			y3 %= this.m;
			if(y3 < 0) y3 += this.m
		}

		return new Point(x3, y3);
	}

	mult(p, n) {
		for(let i = 1; i < n; i++) {
			p = this.sum(p, p)
		}

		return p;
	}
 
	inverseOf(n) {
        n = ( +n ) % this.m;

        if( n < 0 ) {
            n = n + this.m;
        }

        for( var m = 0; m < this.m; m += 1 ) {
            if( ( n * m ) % this.m === 1 ) {
                return m;
            }
        }

        return NaN;
    };

	drawModulo() {
		clearInterval(this.animation);
		this.canvas.clear();

		this.solutions = [];

		let cell_width = this.canvas.width / (this.m + 2);

		this.canvas.context.fillStyle = "gray";

		// Vertical lignes
		for (let i = 0; i < this.m; i ++) {
			let x = i * cell_width;
			this.canvas.context.textAlign="center"; 
			this.canvas.context.fillText(i,x + cell_width + 50, this.canvas.height - 10);
			if(!document.querySelector('#displayGrid').checked) {
			    this.canvas.context.moveTo(x + cell_width + 50, 0, 50);
			    this.canvas.context.lineTo(this.canvas.x_coord(i), this.canvas.height - cell_width);
			}
		}

		// Horizontal lines
		for (let i = 0; i < this.m; i ++) {
			let x = i * cell_width
			this.canvas.context.textAlign="center"; 
			this.canvas.context.fillText(i, 20, this.canvas.height - i * cell_width - cell_width * 2 + 5);
			if(!document.querySelector('#displayGrid').checked) {
			    this.canvas.context.moveTo(50, x + cell_width);
			    this.canvas.context.lineTo(this.canvas.width, x + cell_width);
			}
		}

		this.canvas.context.lineWidth=1;
		this.canvas.context.strokeStyle = "gray";
		this.canvas.context.stroke();


		for(let x = 0; x < this.m; x++) {
			let ys = this.calc(x);
			for(let y_indice = 0; y_indice < ys.length; y_indice++) {

				// Add solutions points

				this.solutions.push(new Point(x, ys[y_indice]));

				this.canvas.context.beginPath();
				this.canvas.context.fillStyle = "green";
				this.canvas.context.arc(this.canvas.x_coord(x), this.canvas.y_coord(ys[y_indice]),POINT_SIZE,0,2*Math.PI);
				this.canvas.context.fillStyle = "green";
				this.canvas.context.fill();
				this.canvas.context.fillStyle = "green";

				// Draw curve
				if(!document.querySelector('#displayCurve').checked) {
					let k = Math.pow(ys[y_indice], 2) - Math.pow(x, 3) - this.a * x - this.b;

					let f = new Elliptic(this.a, this.b + k);

					this.canvas.context.beginPath();
					let bottom = false;
					for(var i = -1; i <= this.m + 1; i = i + 0.01) {
						let y = f.calc(i);
						//if(isNaN(y)) this.canvas.context.beginPath();
						
						if(y > 0 && y <= this.m) this.canvas.context.lineTo(this.canvas.x_coord(i), this.canvas.y_coord(y));

					}

					this.canvas.context.lineWidth=CURVE_SIZE;
					this.canvas.context.strokeStyle = CURVE_COLOR;
					this.canvas.context.stroke();
					}
			}
		}

		let equation_info = document.querySelector('#equation_info').innerHTML = "The curve has " + (this.solutions.length + 1) + " points (including the point at infinity).";
		console.log(this.solutions.length);

	}

	click(point) {
		if(this.solutions.length == 0) return;

		let nearestPoint = this.solutions[0];
		let bestDistance = Math.pow(point.x - this.canvas.x_coord(this.solutions[0].x), 2) + Math.pow(point.y - this.canvas.y_coord(this.solutions[0].y), 2);

		for(let i = 0; i < this.solutions.length; i++) {
			let distance = Math.pow(point.x - this.canvas.x_coord(this.solutions[i].x), 2) + Math.pow(point.y - this.canvas.y_coord(this.solutions[i].y), 2); 
			if(distance < bestDistance) {
				nearestPoint = this.solutions[i];
				bestDistance = distance;
			}
		}

		if(bestDistance > TRIGGER_CLICK_DISTANCE) {
			return;
		};

		// We have a point !

		console.log(nearestPoint);
		this.canvas.context.beginPath();

		let info = document.querySelector('#info');
		let content = document.querySelector('#content');

		switch(this.mode) {
			case 'add':



				if(this.pointsToAdd.length % 2 == 0) {
					if(this.pointsToAdd.length != 0) {
						this.pointsToAdd = [];
						this.drawModulo();
					}
					this.pointsToAdd.push(nearestPoint);
					info.innerHTML = 'Click on the second point to add.';
					content.innerHTML = '<span style="color: ' + COLOR_A + ';">A (' + nearestPoint.x + ', ' + nearestPoint.y + ')</span> + ';
					this.canvas.context.fillStyle = COLOR_A;
					this.canvas.context.fillText('A (' + nearestPoint.x + ', ' + nearestPoint.y + ')',this.canvas.x_coord(nearestPoint.x), this.canvas.y_coord(nearestPoint.y) - 12);
				} else {
					this.pointsToAdd.push(nearestPoint);
					info.innerHTML = 'Here is your result, click on a point to make another addition.';
					content.innerHTML += '<span style="color: ' + COLOR_B + ';">B (' + nearestPoint.x + ', ' + nearestPoint.y + ')</span> = ';
					this.canvas.context.fillStyle = COLOR_B;
					this.canvas.context.fillText('B (' + nearestPoint.x + ', ' + nearestPoint.y + ')',this.canvas.x_coord(nearestPoint.x), this.canvas.y_coord(nearestPoint.y) + 22);
				}
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.canvas.x_coord(nearestPoint.x), this.canvas.y_coord(nearestPoint.y),POINT_SIZE,0,2*Math.PI);
				this.canvas.context.fill();

				if(this.pointsToAdd.length % 2 == 0) {
					this.drawLine();
					let result = this.sum(this.pointsToAdd[0], this.pointsToAdd[1])
					this.canvas.context.fillStyle = COLOR_C;
					content.innerHTML += '<span style="color: ' + COLOR_C + ';">C (' + result.x + ', ' + result.y + ')</span>';
					this.canvas.context.beginPath();
					this.canvas.context.arc(this.canvas.x_coord(result.x), this.canvas.y_coord(result.y),POINT_SIZE,0,2*Math.PI);
					this.canvas.context.fillText('C (' + result.x + ', ' + result.y + ')',this.canvas.x_coord(result.x), this.canvas.y_coord(result.y) + 22);
					this.canvas.context.fill();
					console.log(this.sum(this.pointsToAdd[0], this.pointsToAdd[1]));
				}

				break;
				
			case 'mult':
				console.log("ABCD");
				this.aPoint = nearestPoint;	
				info.innerHTML = 'Now enter an integer n.';
				content.innerHTML = '<span style="color: ' + COLOR_A + ';">A (' + nearestPoint.x + ', ' + nearestPoint.y + ')</span> + ';
				this.canvas.context.fillStyle = COLOR_A;
				this.canvas.context.fillText('A (' + nearestPoint.x + ', ' + nearestPoint.y + ')',this.canvas.x_coord(nearestPoint.x), this.canvas.y_coord(nearestPoint.y) - 12);
			
				info.innerHTML = 'Here is your result, click on a new point to make another multiplication.';
				content.innerHTML += '<span style="color: ' + COLOR_B + ';">B (' + this.n + ')</span> = ';
				this.canvas.context.fillStyle = COLOR_B;
				this.canvas.context.fillText('B (' + this.n + ')',this.n);
				
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.canvas.x_coord(nearestPoint.x), this.canvas.y_coord(nearestPoint.y),POINT_SIZE,0,2*Math.PI);
				this.canvas.context.fill();
				console.log(this.n);
				let result = this.mult(this.aPoint, this.n)
				this.canvas.context.fillStyle = COLOR_C;
				content.innerHTML += '<span style="color: ' + COLOR_C + ';">C (' + result.x + ', ' + result.y + ')</span>';
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.canvas.x_coord(result.x), this.canvas.y_coord(result.y),POINT_SIZE,0,2*Math.PI);
				this.canvas.context.fillText('C (' + result.x + ', ' + result.y + ')',this.canvas.x_coord(result.x), this.canvas.y_coord(result.y) + 22);
				this.canvas.context.fill();
				console.log(this.mult(this.aPont, this.n));
				
				break;
		}		
	}

	drawLine() {

	    let start = this.pointsToAdd[0];
	    let end = this.pointsToAdd[1];

		var progress = { amount: 0 };

	    this.canvas.context.lineWidth=CURVE_SIZE;

	    this.animation = setInterval(()=> {

	    	let point = this.animationLine(this, start, end, progress);

	    	if(point.x >= this.m-1) {				
				let vector = new Point(end.x - start.x, end.y - start.y);
	    		start.x = 0;
	    		start.y = point.y;
	    		end.x = start.x + vector.x;
	    		end.y = start.y + vector.y;
	    		progress.amount = 0; 
			} else if(point.y >= this.m-1) {				
				let vector = new Point(end.x - start.x, end.y - start.y);
	    		start.y = 0;
	    		start.x = point.x;
	    		end.x = start.x + vector.x;
	    		end.y = start.y + vector.y;
	    		progress.amount = 0; 
				} else if(point.x <= 0) {					
					let vector = new Point(end.x - start.x, end.y - start.y);
					start.x = this.m-1;
					start.y = point.y;
					end.x = start.x + vector.x;
					end.y = start.y + vector.y;
					progress.amount = 0; 
					} else if(point.y <= 0) {					
						let vector = new Point(end.x - start.x, end.y - start.y);
						start.y = this.m-1;
						start.x = point.x;
						end.x = start.x + vector.x;
						end.y = start.y + vector.y;
						progress.amount = 0; 
						}
					

	    }, 30);

	}

	animationLine(that, start, end, progress) {
		progress.amount += 0.01; 
		var amount = progress.amount
        that.canvas.context.beginPath();
        //that.canvas.context.clearRect(0, 0, canvas.width, canvas.height);
        that.canvas.context.strokeStyle = "black";
        that.canvas.context.moveTo(that.canvas.x_coord(start.x), that.canvas.y_coord(start.y));
        let distance = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
        let point = new Point(start.x + (end.x - start.x) / Math.sqrt(distance) * LINE_DRAWING_SPEED * amount, start.y + (end.y - start.y) / Math.sqrt(distance) * LINE_DRAWING_SPEED * amount)
        that.canvas.context.lineTo(that.canvas.x_coord(point.x), that.canvas.y_coord(point.y));
        that.canvas.context.stroke();
        return point;
	}


}


function Exception(message) {
   this.message = message;
   this.name = "Exception";
}

/*fonction pour les boutons
$(function(){
   $('.tonBoutton').click(function(){
      $('.tonDiv').toggle() // AFFICHE ET CACHE A CHAQUE CLIQUE SUR LE BOUTTON
   });
});
*/

