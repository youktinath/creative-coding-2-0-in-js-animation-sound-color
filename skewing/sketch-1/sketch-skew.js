/** @format */

const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");

const settings = {
    dimensions: [1080, 1080],
};

const sketch = () => {
    let x, y, w, h;
    let angle, radius;

    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        x = width * 0.5;
        y = height * 0.5;
        w = width * 0.6;
        h = height * 0.1;

        context.save();
        context.translate(x, y);
        // context.translate(w * -0.5, h * -0.5);

        context.strokeStyle = "blue";
        // context.strokeRect(w * -0.5, h * -0.5, w, h);
        // context.beginPath();
        // context.moveTo(0, 0);
        // context.lineTo(w, 0);
        // context.lineTo(w, h);
        // context.lineTo(0, h);
        // context.closePath();
        // context.stroke();

        radius = 300;
        angle = math.degToRad(90);

        x = radius * Math.cos(angle);
        y = radius * Math.sin(angle);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(x, y);
        context.stroke();

        context.restore();
    };
};

canvasSketch(sketch, settings);
