import * as p5 from 'p5';
import { Ball } from './Ball';
import { webMidiInit } from './webMidiInit';

export const sketch = (p: p5) => {
    let ball = new Ball(100, 100)

    p.setup = () => {
        p.createCanvas(600, 600);
        webMidiInit()
    }

    p.draw = () => {
        p.background(220);
        ball.drawLoop(p)
    }
}

export const myp5 = new p5(sketch, document.body);