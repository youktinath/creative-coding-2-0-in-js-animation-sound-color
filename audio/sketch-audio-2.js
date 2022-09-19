/** @format */

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const eases = require("eases");

const settings = {
    dimensions: [1080, 1080],
    animate: true,
};

let manager;
let audio;
let audioContext, audioData, sourceNode, analyserNode;
let minDb, maxDb;

const sketch = () => {
    const numCircles = 5;
    const numSlices = 1;
    const slice = (Math.PI * 2) / numSlices;
    const radius = 200;

    const bins = [];
    const lineWidths = [];
    const rotationOffsets = [];
    let lineWidth, bin, mapped, phi;

    for (let i = 0; i < numCircles * numSlices; i++) {
        bin = random.rangeFloor(4, 64);
        bins.push(bin);
    }

    for (let i = 0; i < numCircles; i++) {
        const t = i / (numCircles - 1);
        lineWidth = eases.quadIn(t) * 200 + 40;
        lineWidths.push(lineWidth);
    }

    for (let i = 0; i < numCircles; i++) rotationOffsets.push(random.range(Math.PI * -0.5, Math.PI * 0.5) + Math.PI * 0.5);
    // audio.autoplay = true;
    // audio.play();

    return ({ context, width, height }) => {
        context.fillStyle = "#EEEAE0";
        context.fillRect(0, 0, width, height);

        if (!audioContext) return;
        analyserNode.getFloatFrequencyData(audioData);

        context.save();
        context.translate(width * 0.5, height * 0.5);
        context.scale(1, -1);

        let cradius = radius;

        for (let i = 0; i < numCircles; i++) {
            context.save();
            context.rotate(rotationOffsets[i]);
            cradius += lineWidths[i] * 0.5 + 10;

            for (let j = 0; j < numSlices; j++) {
                context.rotate(slice);
                context.lineWidth = lineWidths[i];

                bin = bins[i * numSlices + j];

                mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);
                phi = slice * mapped;

                context.beginPath();
                context.arc(0, 0, cradius, 0, phi);
                context.stroke();
            }
            cradius += lineWidths[i] * 0.5;

            context.restore();
        }

        context.restore();

        // for (let i = 0; i < bins.length; i++) {
        //     const bin = bins[i];
        //     const mapped = math.mapRange(audioData[bin], analyserNode.minDecibels, analyserNode.maxDecibels, 0, 1, true);
        //     const radius = mapped * 350;
        // }
    };
};

const addListener = () => {
    window.addEventListener("mouseup", () => {
        if (!audioContext) createAudio();

        if (audio.paused) {
            audio.play();
            manager.play();
        } else {
            audio.pause();
            manager.pause();
        }
    });
};

const createAudio = () => {
    audio = document.createElement("audio");
    audio.src = "./files/Francesco DAndrea - By the Mombaasa River.mp3";

    audioContext = new AudioContext();

    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(audioContext.destination);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2 ** 9;
    analyserNode.smoothingTimeConstant = 0.9;
    sourceNode.connect(analyserNode);

    minDb = analyserNode.minDecibels;
    maxDb = analyserNode.maxDecibels;

    audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }
    return sum / data.length;
};

const start = async () => {
    addListener();
    manager = await canvasSketch(sketch, settings);
    manager.pause();
};

start();
