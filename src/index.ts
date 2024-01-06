import * as p5 from 'p5';
import * as M from './Machine';
import * as drawing from './drawing'
import * as colorSchemes from './colorSchemes'
import * as presets from './presets'
import { SoundPlayer, articulate, addSoundPlayers } from './sound'; 
import { webMidiInit } from './webMidiInit';

export const sketch = (p: p5) => {
    let grid = M.createNewGrid()
    let drawingConfig: drawing.DrawConfig

    p.setup = () => {
        drawingConfig = drawing.generateDrawConfig(presets.triSystem, colorSchemes.scheme1 )
        p.createCanvas(drawingConfig.canvasX, drawingConfig.canvasY);
        grid = M.createNewGrid(presets.triSystem)
        grid = addSoundPlayers(grid)
        webMidiInit()
        p.frameRate(6)
    }

    p.draw = () => {
        drawing.drawGrid(p, grid, drawingConfig)
        grid = M.applyRule(grid)
        articulate(grid)

    }
}

export const myp5 = new p5(sketch, document.body);