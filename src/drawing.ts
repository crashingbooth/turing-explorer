import * as Machine from './Machine';
import * as p5 from 'p5';


const maxWidth = 1200
const maxHeight = 800

export type PColor = [number,number,number]
export type ColorScheme = Array<PColor>

export interface DrawConfig {
    colorScheme: ColorScheme,
    canvasX: number,
    canvasY: number
    unitSize: number
}

export const generateDrawConfig = (systemConfig: Machine.SystemConfig, colorScheme: ColorScheme) => {
    const heightMultiplier = systemConfig.sides == Machine.Sides.Three ? (Math.sqrt(3)/2) : 1
    const maximizeHeight = systemConfig.numCols / (systemConfig.numRows * heightMultiplier) < maxWidth / maxHeight

    const unitSize = maximizeHeight ? maxHeight / (systemConfig.numRows * heightMultiplier) : maxWidth / systemConfig.numCols

    return {
        colorScheme: colorScheme,
        canvasX: unitSize * systemConfig.numCols,
        canvasY: unitSize * systemConfig.numRows,
        unitSize: unitSize
    }
}

export const drawGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    p.background(0)
    p.noStroke()

    if (grid.system.sides === Machine.Sides.Three) {
        drawTriangularGrid(p, grid, drawConfig)
    } else {
        drawSquareGrid(p, grid, drawConfig)
    }
}

const drawSquareGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state = grid.space[row][col]
            p.fill(Math.floor(state/grid.system.numStates * 255))
            p.circle(col * drawConfig.unitSize + drawConfig.unitSize / 2, row * drawConfig.unitSize + drawConfig.unitSize / 2, drawConfig.unitSize)
        }
    }
}

const drawTriangularGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    const triHeight = drawConfig.unitSize * Math.sqrt(3) / 2
    let unit = drawConfig.unitSize
    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state =  grid.space[row][col]
            const fillCol = drawConfig.colorScheme[state % drawConfig.colorScheme.length]// Math.floor(state/grid.system.numStates * 255)
            // const fillCol: [number, number, number] = [fill,fill,fill]
            let tempFill: [number,number,number] = [0,0,0]
            if (row % 2 === 0) {
                if (col % 2 === 0) {
                    drawDownTriangle(p, fillCol, (col/2) * unit, row * triHeight, unit, triHeight )
                } else {
                    drawUpTriangle(p, fillCol, ((col + 1)/2*unit) , row * triHeight, unit, triHeight )
                }
            } else {
                if (col % 2 === 0) {
                    drawUpTriangle(p, fillCol, unit/2 + ((col/2) * unit) , row * triHeight, unit, triHeight )
                } else {
                    drawDownTriangle(p, fillCol, unit/2 + ((col - 1)/2) * unit, row * triHeight, unit, triHeight )
                }
            }
        }
    }
}

const drawDownTriangle = (p: p5, fill: [number,number,number], x: number, y: number, unit: number, triHeight: number) => {
    p.fill(...fill)
    p.triangle(x,y,  x + unit,y,  x+(unit/2),y+triHeight)
}

const drawUpTriangle = (p: p5, fill:  [number,number,number], x: number, y: number, unit: number, triHeight: number) => {
    p.fill(...fill)
    p.triangle(x,y,   x+(unit/2),y+triHeight,  x-(unit/2),y+triHeight)
}