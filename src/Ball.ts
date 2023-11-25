import { WebMidi } from "webmidi";
import * as p5 from 'p5';

export class Ball {
    x: number
    y: number
    radius: number
    yVel: number
    xVel: number
    p: p5
    gravity: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = 20
        this.yVel = 2
        this.xVel = 0
        this.gravity = 0.2
    }
    
    move(height: number) {
        this.yVel += this.gravity
        this.y += this.yVel
        this.x += this.xVel
        if (this.y > height) {
            this.y = height
        }
    }

    bounceIfNeeded(height: number) {
        if (this.y < height) { return }

        if (this.yVel > this.gravity) {
            this.yVel *= -0.8
            this.xVel += 0.3
            this.play()
            console.log(`HIT`);
        } else {
            this.yVel = 0
        }

        if (this.x > 1000) {
            this.x = 100
            this.y = 0
            this.xVel = 0
        }

    }

    drawLoop(p: p5) {
        this.move(p.height)
        p.circle(this.x, this.y - this.radius, this.radius * 2)
        this.bounceIfNeeded(p.height)
    }

    play() {
        WebMidi.outputs[0].channels[1].playNote("C3", { duration: 1000 });
        console.log(`PLAY`);
    }
}

