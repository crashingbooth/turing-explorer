import * as p5 from 'p5';
import * as M from './Machine';
import { SoundPlayer, articulate, addSoundPlayers } from './sound'; 
import { webMidiInit } from './webMidiInit';

export const sketch = (p: p5) => {
    let grid = M.createNewGrid()

    p.setup = () => {
        p.createCanvas(1200, 800);
        grid = M.createNewGrid(128,64,M.weirdLangtonsAntFactory([1,-1,2,-2]))
        // grid = addSoundPlayers(grid)
        webMidiInit()
        p.frameRate(60)
    }

    p.draw = () => {
        M.drawGrid(p, grid)
        grid = M.applyRule(grid)
        // articulate(grid)

    }
}

export const myp5 = new p5(sketch, document.body);