import { WebMidi } from "webmidi";
import { SoundPlayer } from './sound';

export type State = number
export type Dir = number

export type StateDir = {
    state: State,
    dir: Dir
}

export type Rule = (initial: StateDir) => StateDir

export interface Point {
    x: number
    y: number
}

export interface SystemConfig {
    numRows: number
    numCols: number
    numStates: number
    numDirs: number
    rule: Rule
}

const defaultConfig: SystemConfig = {
    numRows: 4,
    numCols: 4,
    numStates: 4,
    numDirs: 4,
    rule: (stateDir) => stateDir
}

const normalizeSingle = (val: number, max: number): number => {
    let newVal = val < 0 ? max + val : val
    return val >= max ? (val % max) : newVal
}

export const normalizePoint = (point: Point, system: SystemConfig): Point => {
    return {
        x: normalizeSingle(point.x, system.numCols),
        y: normalizeSingle(point.y, system.numRows)
    }
}

export const normalizeRuleOutput = (stateDir: StateDir, config: SystemConfig) => {
    return {
        state: normalizeSingle(stateDir.state, config.numStates),
        dir: normalizeSingle(stateDir.dir, config.numDirs)
    }
}

export interface Machine {
    point: Point
    dir: Dir
}

export interface Grid {
    system: SystemConfig
    machines: Machine[]
    space: State[][]
    statePlayer?: SoundPlayer
    dirPlayer?: SoundPlayer
}

export const movePoint = (point: Point, dir: Dir): Point => {
    const normalizedDirection = dir < 0 ? dir += 4 : dir % 4

    if (normalizedDirection == 0) {
        return { ...point, y: point.y - 1 }
    } else if (normalizedDirection == 1) {
        return { ...point, x: point.x + 1 }
    } else if (normalizedDirection == 2) {
        return { ...point, y: point.y + 1 }
    } else if (normalizedDirection == 3) {
        return { ...point, x: point.x - 1 }
    } else {
        return { ...point }
    }
}

// Rules

const applyDirection = (start: Dir, change: Dir, system: SystemConfig): Dir => {
    let newRawDir = start + change
    console.log(`start: ${start}, change ${change}: res: ${normalizeSingle(newRawDir, system.numDirs)}`);

    return normalizeSingle(newRawDir, system.numDirs)
}


export const applyRule = (grid: Grid): Grid => {
    let newGrid = grid
    grid.machines.forEach((machine, i) => {
        // move machine in its direction, get new Point
        const newPoint = movePoint(machine.point, machine.dir)
        const normalizedPoint = normalizePoint(newPoint, grid.system)
        // get new StateDir
        const newStateDir = {
            state: grid.space[normalizedPoint.y][normalizedPoint.x],
            dir: machine.dir
        }
        // get rule output for new StateDir
        const ruleOutput = grid.system.rule(newStateDir)
        const normalizedRuleOutput = normalizeRuleOutput(ruleOutput, grid.system)
        // get updated Direction
        const newDirection = applyDirection(machine.dir, normalizedRuleOutput.dir, grid.system)

        // update space
        grid.space[normalizedPoint.y][normalizedPoint.x] = normalizedRuleOutput.state
        // update machine
        grid.machines[i] = { point: { ...normalizedPoint }, dir: newDirection }
    })

    return grid
}

export const createSpace = (system: SystemConfig): State[][] => {
    const space: State[][] = Array.from({ length: system.numRows }, () =>
        Array.from({ length: system.numCols }, () => 0)
    )
    return space
}

export const createNewGrid = (config: SystemConfig = defaultConfig, xOffset: number = 0, yOffset: number = 0) => {
    return {
        system: config,
        machines: [{ point: { x: Math.floor(config.numCols / 2) + xOffset, y: Math.floor(config.numRows / 2) + yOffset }, dir: 0 }],
        space: createSpace(config)
    }
}

export const langtonsAntFactory = (orderedDirs: Dir[]) => {
    return (stateDir: StateDir) => {
        return {
            state: normalizeSingle(stateDir.state + 1, orderedDirs.length),
            dir: orderedDirs[stateDir.state]
        }
    }
}

export const weirdLangtonsAntFactory = (orderedDirs: Dir[]) => {
    return (stateDir: StateDir) => {
        const change = (stateDir.dir % 2 == 0) ? 1 : -1
        return {
            state: normalizeSingle((stateDir.state + 1) * change, orderedDirs.length),
            dir: orderedDirs[stateDir.state]
        }
    }
}

// other file for drawing

// export const drawGrid = (p: p5, grid: Grid) => {
//     p.background(0)
//     p.noStroke()
//     const unit = p.width / grid.system.numCols
//     for (let row = 0; row < grid.system.numRows; row++) {
//         for (let col = 0; col < grid.system.numCols; col++) {
//             const state = grid.space[row][col]
//             p.fill(Math.floor(state/grid.system.numStates * 255))
//             p.circle(col * unit, row * unit, unit)
//         }
//     }
// }


