class Canvas {

	constructor(canvas, m) {


	    let that = this;
        m.addEventListener('change', function(){
            that.draw();
            console.log('ppppp')
            console.log(m.value)
            that.cellsByLine = parseFloat(m.value);
        });


		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.cellsByLine = parseFloat(m.value);
		this.cell_width = this.canvas.width / (this.cellsByLine + 2);
		this.context.font = "15px Arial";
        console.log(this.cellsByLine)
	}

	draw() {
	    console.log('aze');
        this.clear();

        this.solutions = [];

        let cell_width = this.canvas.width / (this.cellsByLine + 2);

        this.context.fillStyle = "gray";
        console.log(this.cellsByLine);
        // Vertical lignes
        for (let i = 0; i < this.cellsByLine; i ++) {
            console.log('a');
            let x = i * cell_width;
            this.context.textAlign="center";
            this.context.fillText(i,x + cell_width + 50, this.canvas.height - 10);
            if(!document.querySelector('#displayGrid').checked) {
                this.context.moveTo(x + cell_width + 50, 0, 50);
                this.context.lineTo(this.x_coord(i), this.canvas.height - cell_width);
            }
        }

        // Horizontal lines
        for (let i = 0; i < this.cellsByLine; i ++) {
            let x = i * cell_width;
            this.context.textAlign="center";
            this.context.fillText(i, 20, this.canvas.height - i * cell_width - cell_width * 2 + 5);
            if(!document.querySelector('#displayGrid').checked) {
                this.context.moveTo(50, x + cell_width);
                this.context.lineTo(this.canvas.width, x + cell_width);
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