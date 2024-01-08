import * as Machine from './Machine';
import * as p5 from 'p5';


const maxWidth = 1920 * 1.2// 1200
const maxHeight = 1080 * 1.2 // 800

const triangleHeight = (Math.sqrt(3)/2)

export type PColor = [number,number,number]
export type ColorScheme = Array<PColor>

export interface DrawConfig {
    colorScheme: ColorScheme,
    canvasX: number,
    canvasY: number,
    unitSize: number,
    globalXOffset: number,
    globalYOffset: number,
    defaultMachineStart?: [Machine.Machine] // if no machines are included in the preset, start with one in centre
}

// drawConfig
export const generateDrawConfig = (systemConfig: Machine.SystemConfig, colorScheme: ColorScheme, xOffset: number = 0, yOffset: number = 0): DrawConfig => {
    
    let unitSize: number
    if (systemConfig.sides === Machine.Sides.Four) {
        unitSize = getUnitSizeForFour(systemConfig)
    } else if (systemConfig.sides === Machine.Sides.Three) {
        unitSize = getUnitSizeForThree(systemConfig)
    }
    let yUnitSize = systemConfig.sides === Machine.Sides.Three ? unitSize * triangleHeight : unitSize

    return {
        colorScheme: colorScheme,
        canvasX: unitSize * systemConfig.numCols,
        canvasY: yUnitSize * systemConfig.numRows,
        unitSize: unitSize,
        globalXOffset: xOffset,
        globalYOffset: yOffset,
        defaultMachineStart: getDefaultMachineStartPoint(systemConfig)
    }
}

const getUnitSizeForFour =  (systemConfig: Machine.SystemConfig) => {

    const maximizeHeight = systemConfig.numCols / systemConfig.numRows < maxWidth / maxHeight
    const unitSize = maximizeHeight ? maxHeight / systemConfig.numRows : maxWidth / systemConfig.numCols

    return unitSize
}

const getUnitSizeForThree =  (systemConfig: Machine.SystemConfig) => {
    const factoredWidth = systemConfig.numCols / 2
    const factoredHeight = systemConfig.numRows * triangleHeight

    const maximizeHeight =  factoredWidth / factoredHeight < maxWidth / maxHeight
    const unitSize = maximizeHeight ? maxHeight / factoredHeight : maxWidth / factoredWidth
    
    return unitSize
}

const getDefaultMachineStartPoint = (systemConfig: Machine.SystemConfig): [Machine.Machine] => {
    return [{point: { x: Math.floor(systemConfig.numCols / 2), y: Math.floor(systemConfig.numRows / 2)}, dir :0}]
}

/// DRAWING

export const drawGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    p.background(drawConfig.colorScheme[0])
    // p.noStroke()
    p.stroke(drawConfig.colorScheme[0])
    p.strokeWeight(1)

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
            p.circle(col * drawConfig.unitSize + drawConfig.unitSize / 2 + drawConfig.globalXOffset, row * drawConfig.unitSize + drawConfig.unitSize / 2 + drawConfig.globalYOffset, drawConfig.unitSize)
        }
    }
}

const drawTriangularGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    const triHeight = drawConfig.unitSize * Math.sqrt(3) / 2
    let unit = drawConfig.unitSize
    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state =  grid.space[row][col]
            p.fill(...drawConfig.colorScheme[state % drawConfig.colorScheme.length])

            const startOffset = unit/2
            if (row % 2 === 0) {
                if (col % 2 === 0) {
                    drawDownTriangle(p, (col/2) * unit, row * triHeight, unit, triHeight, drawConfig)
                } else {
                    drawUpTriangle(p, (col + 1)/2 * unit , row * triHeight, unit, triHeight, drawConfig)
                }
            } else {
                if (col % 2 === 0) {
                    drawUpTriangle(p, startOffset + (col/2) * unit , row * triHeight, unit, triHeight, drawConfig)
                } else {
                    drawDownTriangle(p, startOffset + ((col - 1)/2) * unit, row * triHeight, unit, triHeight, drawConfig)
                }
            }
        }
    }
}

const drawDownTriangle = (p: p5, x: number, y: number, unit: number, triHeight: number, drawConfig: DrawConfig) => {
    x = x + drawConfig.globalXOffset
    y = y + drawConfig.globalYOffset
    p.triangle(x,y,  x + unit,y,  x+(unit/2),y+triHeight)
}

const drawUpTriangle = (p: p5, x: number, y: number, unit: number, triHeight: number, drawConfig: DrawConfig) => {
    x = x + drawConfig.globalXOffset
    y = y + drawConfig.globalYOffset
    p.triangle(x,y,   x+(unit/2),y+triHeight,  x-(unit/2),y+triHeight)
}