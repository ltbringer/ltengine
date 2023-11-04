import { Environment } from "./engine/environment";

const canvas = document.createElement('canvas');
if (!canvas) {
    throw new Error('Could not find canvas element');
}
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Could not create canvas context');
}
const env = new Environment(50, 50, canvas, ctx, 20);
env.render();
