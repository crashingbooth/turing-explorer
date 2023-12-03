import * as p5 from 'p5';
import * as M from './Machine';
import { webMidiInit } from './webMidiInit';

export const sketch = (p: p5) => {
    let grid = M.createNewGrid()

    p.setup = () => {
        p.createCanvas(800, 800);
        grid = M.createNewGrid(72,72,M.weirdLangtonsAntFactory([1,-1,2,-2]))
        // webMidiInit()
        p.frameRate(20)
    }

    p.draw = () => {
        M.drawGrid(p, grid)
        grid = M.applyRule(grid)

    }
}

export const myp5 = new p5(sketch, document.body);