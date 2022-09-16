/** @format */

const canvasSketch = require("canvas-sketch");

const settings = {
    dimensions: [1080, 1080],
    animate: true,
};

let elCanvas;
let points;

const sketch = ({ canvas }) => {
    points = [new Point({ x: 10, y: 10 }), new Point({ x: 10, y: 600 }), new Point({ x: 600, y: 600 }), new Point({ x: 600, y: 10 }), new Point({ x: 300, y: 300 })];

    canvas.addEventListener("mousedown", onMouseDown);

    elCanvas = canvas;

    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        // for (let i = 1; i < points.length; i += 2) {
        //     context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        // }
        // context.moveTo(200, 540);
        // context.quadraticCurveTo(400, 300, 800, 540);
        for (let i = 0; i < points.length; i++) {
            // if (i == 0) context.moveTo(curr.x, curr.y);
            // else if (i == points.length - 2) context.lineTo(curr.x, curr.y);
            context.lineTo(points[i].x, points[i].y);
        }
        context.strokeStyle = "#999";
        context.stroke();

        context.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];

            const mx = curr.x + (next.x - curr.x) * 0.5;
            const my = curr.y + (next.y - curr.y) * 0.5;

            if (i == 0) context.moveTo(curr.x, curr.y);
            else if (i == points.length - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
            else context.quadraticCurveTo(curr.x, curr.y, mx, my);
        }
        context.strokeStyle = "blue";
        context.lineWidth = 10;
        context.stroke();

        points.forEach((point) => {
            point.draw(context);
        });
    };
};

const onMouseDown = (e) => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
    y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

    let hit = false;
    points.forEach((point) => {
        point.isDragging = point.hitTest(x, y);
        if (!hit && point.isDragging) hit = true;
    });
    if (!hit) points.push(new Point({ x, y }));
};

const onMouseMove = (e) => {
    x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
    y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
    // console.log(x, y);

    points.forEach((point) => {
        if (point.isDragging) {
            point.x = x;
            point.y = y;
        }
    });
};

const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
};

canvasSketch(sketch, settings);

class Point {
    constructor({ x, y, control = false }) {
        this.x = x;
        this.y = y;
        this.control = control;
    }
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = this.control ? "red" : "blue";

        context.beginPath();
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }
    hitTest(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        const dd = Math.sqrt(dx * dx + dy * dy);
        return dd < 20;
    }
}
