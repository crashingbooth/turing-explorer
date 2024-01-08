import * as p5 from 'p5';
import * as M from './Machine';
import * as drawing from './drawing'
import * as colorSchemes from './colorSchemes'
import { Preset, triSystemPreset, triangleLangtonPreset , triangleLangtonBasic}  from './presets'
import { SoundPlayer, articulate, addSoundPlayers, addSoundPlayersFromPreset, bpmToFrameRate } from './sound'; 
import { webMidiInit } from './webMidiInit';

export const sketch = (p: p5) => {
    const delay = 0
    let grid: M.Grid
    let frame = 0
    let drawingConfig: drawing.DrawConfig
    let preset: Preset = triangleLangtonBasic

    p.setup = () => {
        drawingConfig = preset.drawConfig
        p.createCanvas(preset.drawConfig.canvasX, preset.drawConfig.canvasY)
        grid = M.createNewGrid(preset)
        console.log(`INDEX ${preset.machines}`);
        grid = addSoundPlayersFromPreset(grid, preset)
        webMidiInit()
        p.frameRate(bpmToFrameRate(preset.bpm))

    }

    p.draw = () => {
        p.background(drawingConfig.colorScheme[0])
        frame += 1
        if (frame < delay) { return }
        drawing.drawGrid(p, grid, drawingConfig)
        grid = M.applyRule(grid)
        articulate(grid)
    }
}

export const myp5 = new p5(sketch, document.body);