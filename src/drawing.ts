import * as Machine from './Machine';
import * as p5 from 'p5';

const mult = 0.8
const maxWidth = 1920 * mult * mult// 1200
const maxHeight = 1080 * mult // 800

const triangleHeight = (Math.sqrt(3) / 2)
const hexExtraWidthFactor = Math.sin(2 * Math.PI / 6) // 1 col = unit + 2 * hexExtraWidthFactor(unit)
const hexExtraHeightFactor = Math.cos(2 * Math.PI / 6) // 1 row = 2 * hexExtraWidthFactor(unit)

export type PColor = [number, number, number]
export type ColorScheme = Array<PColor>

export interface DrawConfig {
    colorScheme: ColorScheme,
    canvasX: number,
    canvasY: number,
    unitSize: number,
    globalXOffset: number,
    globalYOffset: number,
    swapXY: boolean,
    defaultMachineStart?: [Machine.Machine] // if no machines are included in the preset, start with one in centre
}

// drawConfig
export const generateDrawConfig = (systemConfig: Machine.SystemConfig,
    colorScheme: ColorScheme,
    swapXY: boolean = false,
    xOffset: number = 0,
    yOffset: number = 0): DrawConfig => {

    let unitSize: number
    if (systemConfig.sides === Machine.Sides.Four || systemConfig.sides === Machine.Sides.Eight) {
        unitSize = getUnitSizeForFour(systemConfig)
    } else if (systemConfig.sides === Machine.Sides.Three) {
        unitSize = getUnitSizeForThree(systemConfig)
    } else if (systemConfig.sides === Machine.Sides.Six) {
        unitSize = getUnitSizeForSix(systemConfig, swapXY)
    }

    let yUnitSize = systemConfig.sides === Machine.Sides.Three ? unitSize * triangleHeight : unitSize

    let canvasSize: [number, number]
    if (systemConfig.sides === Machine.Sides.Four || systemConfig.sides === Machine.Sides.Eight) {
        canvasSize = [systemConfig.numCols * unitSize, systemConfig.numRows * unitSize]
    } else if (systemConfig.sides === Machine.Sides.Three) {
        canvasSize = [systemConfig.numCols * unitSize, systemConfig.numRows * yUnitSize]
    } else if (systemConfig.sides === Machine.Sides.Six) {
        canvasSize = [systemConfig.numCols * unitSize * 2, systemConfig.numRows * unitSize * triangleHeight * 2]
    }

    return {
        colorScheme: colorScheme,
        canvasX: canvasSize[0],
        canvasY: canvasSize[1],
        unitSize: unitSize,
        globalXOffset: xOffset,
        globalYOffset: yOffset,
        swapXY: swapXY,
        defaultMachineStart: getDefaultMachineStartPoint(systemConfig)
    }
}

const getUnitSizeForFour = (systemConfig: Machine.SystemConfig) => {

    const maximizeHeight = systemConfig.numCols / systemConfig.numRows < maxWidth / maxHeight
    const unitSize = maximizeHeight ? maxHeight / systemConfig.numRows : maxWidth / systemConfig.numCols

    return unitSize
}

const getUnitSizeForThree = (systemConfig: Machine.SystemConfig) => {
    const factoredWidth = systemConfig.numCols / 2
    const factoredHeight = systemConfig.numRows * triangleHeight

    const maximizeHeight = factoredWidth / factoredHeight < maxWidth / maxHeight
    const unitSize = maximizeHeight ? maxHeight / factoredHeight : maxWidth / factoredWidth

    return unitSize
}

const getUnitSizeForSix = (systemConfig: Machine.SystemConfig, isSwapping: boolean) => {
    return getUnitSizeForSixByHeight(systemConfig, isSwapping)
}

const getUnitSizeForSixByHeight = (systemConfig: Machine.SystemConfig, isSwapping: boolean) => {
    return (isSwapping ? maxWidth : maxHeight) / (systemConfig.numRows * Math.sqrt(3))
}


const getDefaultMachineStartPoint = (systemConfig: Machine.SystemConfig): [Machine.Machine] => {
    return [{ point: { x: Math.floor(systemConfig.numCols / 2), y: Math.floor(systemConfig.numRows / 2) }, dir: 0 }]
}

/// DRAWING

export const drawGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    p.background(drawConfig.colorScheme[0])
    p.noStroke()
    // p.stroke(drawConfig.colorScheme[0])
    // p.strokeWeight(0.3)

    if (grid.system.sides === Machine.Sides.Three) {
        drawTriangularGrid(p, grid, drawConfig)
    } else if (grid.system.sides === Machine.Sides.Four) {
        drawSquareGrid(p, grid, drawConfig)
    } else if ((grid.system.sides === Machine.Sides.Six)) {
        drawHexagonalGrid(p, grid, drawConfig)
    }  else if ((grid.system.sides === Machine.Sides.Eight)) {
        drawSquareGrid(p, grid, drawConfig)
    }
}

const drawSquareGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state = grid.space[row][col]
            p.fill(...drawConfig.colorScheme[state % drawConfig.colorScheme.length])
            p.circle(col * drawConfig.unitSize + drawConfig.unitSize / 2 + drawConfig.globalXOffset, row * drawConfig.unitSize + drawConfig.unitSize / 2 + drawConfig.globalYOffset, drawConfig.unitSize)
        }
    }
}

const drawHexagonalGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    const offsetY = Math.sin(p.radians(60)) * drawConfig.unitSize;
    const offsetX = Math.cos(p.radians(60)) * drawConfig.unitSize;
    const unit = drawConfig.unitSize

    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state = grid.space[row][col]
            p.fill(...drawConfig.colorScheme[state % drawConfig.colorScheme.length])
            const yOff = col % 2 == 0 ? 0 : offsetY;
            makeHexagonalCell(p,
                col * (drawConfig.unitSize + offsetX) + drawConfig.globalXOffset,
                row * (offsetY * 2) + yOff + drawConfig.globalYOffset,
                unit,
                offsetX,
                offsetY,
                drawConfig.swapXY
            )
        }
    }
}

const invertableVertex = (p: p5, x: number, y: number, invert: boolean) => {
    const newX = invert ? y : x
    const newY = invert ? x : y
    p.vertex(newX, newY)
}

const makeHexagonalCell = (p: p5, x: number, y: number, unit: number, xOffset: number, yOffset: number, isSwapping: boolean) => {

    p.beginShape()
    invertableVertex(p, x, y, isSwapping)
    invertableVertex(p, x + unit, y, isSwapping)
    invertableVertex(p, x + unit + xOffset, y + yOffset, isSwapping);
    invertableVertex(p, x + unit, y + yOffset * 2, isSwapping);
    invertableVertex(p, x, y + yOffset * 2, isSwapping);
    invertableVertex(p, x - xOffset, y + yOffset, isSwapping)
    p.endShape(p.CLOSE);
}

const drawTriangularGrid = (p: p5, grid: Machine.Grid, drawConfig: DrawConfig) => {
    const triHeight = drawConfig.unitSize * Math.sqrt(3) / 2
    let unit = drawConfig.unitSize
    for (let row = 0; row < grid.system.numRows; row++) {
        for (let col = 0; col < grid.system.numCols; col++) {
            const state = grid.space[row][col]
            p.fill(...drawConfig.colorScheme[state % drawConfig.colorScheme.length])

            const startOffset = unit / 2
            if (row % 2 === 0) {
                if (col % 2 === 0) {
                    drawDownTriangle(p, (col / 2) * unit, row * triHeight, unit, triHeight, drawConfig)
                } else {
                    drawUpTriangle(p, (col + 1) / 2 * unit, row * triHeight, unit, triHeight, drawConfig)
                }
            } else {
                if (col % 2 === 0) {
                    drawUpTriangle(p, startOffset + (col / 2) * unit, row * triHeight, unit, triHeight, drawConfig)
                } else {
                    drawDownTriangle(p, startOffset + ((col - 1) / 2) * unit, row * triHeight, unit, triHeight, drawConfig)
                }
            }
        }
    }
}

const drawTriangle = (p: p5, [x1, y1, x2, y2, x3, y3]: [number, number, number, number, number, number], isSwapping: boolean) => {
    const args: [number, number, number, number, number, number] = isSwapping ? [y1, x1, y2, x2, y3, x3] : [x1, y1, x2, y2, x3, y3]
    p.triangle(...args)
}

const drawDownTriangle = (p: p5, x: number, y: number, unit: number, triHeight: number, drawConfig: DrawConfig) => {
    x = x + drawConfig.globalXOffset
    y = y + drawConfig.globalYOffset
    drawTriangle(p, [x, y, x + unit, y, x + (unit / 2), y + triHeight], drawConfig.swapXY)
}

const drawUpTriangle = (p: p5, x: number, y: number, unit: number, triHeight: number, drawConfig: DrawConfig) => {
    x = x + drawConfig.globalXOffset
    y = y + drawConfig.globalYOffset
    drawTriangle(p, [x, y, x + (unit / 2), y + triHeight, x - (unit / 2), y + triHeight], drawConfig.swapXY)
}




