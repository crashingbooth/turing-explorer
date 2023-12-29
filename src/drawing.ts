import * as Machine from './Machine';
import * as p5 from 'p5';


const maxWidth = 1200
const maxHeight = 800

export interface DrawConfig {
    canvasX: number,
    canvasY: number
    unitSize: number
}

export const generateDrawConfig = (systemConfig: Machine.SystemConfig) => {
    const maximizeHeight = systemConfig.numCols / systemConfig.numRows < maxWidth / maxHeight

    const unitSize = maximizeHeight ? maxHeight / systemConfig.numRows : maxWidth / systemConfig.numCols

    return {
        canvasX: unitSize * systemConfig.numCols,
        canvasY: unitSize * systemConfig.numRows,
        unitSize: unitSize
    }
}

export const drawGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    p.background(0)
    p.noStroke()
    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state = grid.space[row][col]
            p.fill(Math.floor(state/grid.system.numStates * 255))
            p.circle(col * drawConfig.unitSize + drawConfig.unitSize / 2, row * drawConfig.unitSize + drawConfig.unitSize / 2, drawConfig.unitSize)
        }
    }
}