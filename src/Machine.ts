import { WebMidi } from "webmidi";
import { SoundPlayer } from './sound';
import { ColorScheme } from "./drawing";
import { Preset } from "./presets";
import { log } from "tone/build/esm/core/util/Debug";

export type State = number
export type Dir = number

export enum Sides {
    Four,
    Three,
    Six
}

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
    sides: Sides
    colorScheme? : ColorScheme 
    rule: Rule
}

const defaultConfig: SystemConfig = {
    numRows: 4,
    numCols: 4,
    numStates: 4,
    numDirs: 4,
    sides: Sides.Four,
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
    lastChange?: Dir 
}

export interface Grid {
    system: SystemConfig
    machines: Machine[]
    space: State[][]
    statePlayer?: SoundPlayer
    dirPlayer?: SoundPlayer
    changePlayer?: SoundPlayer
}

export const movePoint = (sides: Sides, point: Point, dir: Dir): Point => {
    if (sides === Sides.Three) {
        return movePointFor3(point, dir, 6)
    } else if (sides === Sides.Four) {
        return movePointFor4(point, dir, 4)
    } else if (sides === Sides.Six) {
        return movePointFor6(point, dir, 6)
    }
}

const debugPoint = (point: Point): string => {
    return `x:${point.x},y:${point.y}`
}

const movePointFor4 = (point: Point, dir: Dir, numDirs: number): Point => {
    const normalizedDirection = dir < 0 ? dir += numDirs : dir % numDirs
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

const movePointFor3 = (point: Point, dir: Dir, numDirs: number): Point => {
    const normalizedDirection = dir < 0 ? dir += numDirs : dir % numDirs
    const isDown = point.x + point.y % 2 === 0
    

    if (normalizedDirection == 0) {
        return { x: point.x, y: point.y - 1}
    } else if (normalizedDirection == 1) {
        return { x: point.x + 1, y: point.y }
    } else if (normalizedDirection == 2) {
        return { x: point.x + 1, y: point.y }
    } else if (normalizedDirection == 3) {
        return { x: point.x , y: point.y + 1}
    } else if (normalizedDirection == 4) {
        return { x: point.x - 1, y: point.y }
    } else if (normalizedDirection == 5) {
        return { x: point.x - 1, y: point.y }
    } else {
        return { ...point }
    }
}

const movePointFor6 = (point: Point, dir: Dir, numDirs: number = 6): Point => {
    const normalizedDirection = dir < 0 ? dir += numDirs : dir % numDirs
    console.log(`normalDir ${normalizedDirection}`);
    
    let oddCol = point.x % 2 !== 0;

    if (normalizedDirection == 0) {
        return { x: point.x, y: point.y - 1}
    } else if (normalizedDirection == 1) {
        return { x: point.x + 1, y: point.y + (oddCol ? 0 : -1) }
    } else if (normalizedDirection == 2) {
        return { x: point.x + 1, y: point.y + (oddCol ? 1 : 0 )}
    } else if (normalizedDirection == 3) {
        return { x: point.x , y: point.y + 1}
    } else if (normalizedDirection == 4) {
        return { x: point.x - 1, y: point.y + (oddCol ? 1 : 0) }
    } else if (normalizedDirection == 5) {
        return { x: point.x - 1, y: point.y - (oddCol ? 0 : 1 )}
    } else {
        return { ...point }
    }
}

// Rules

const applyDirection = (start: Dir, change: Dir, system: SystemConfig): Dir => {
    let newRawDir = start + change
    return normalizeSingle(newRawDir, system.numDirs)
}


export const applyRule = (grid: Grid): Grid => {
    let newGrid = grid
    grid.machines.forEach((machine, i) => {
        // move machine in its direction, get new Point
        const newPoint = movePoint(grid.system.sides, machine.point, machine.dir)
        // console.log(`apply rule: oldPoint ${debugPoint(machine.point)}  newPoint ${debugPoint(newPoint)}`);
        
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
        // console.log(`applyRule, point: ${debugPoint(normalizedPoint)}, newState: ${normalizedRuleOutput.state}`);
        
        // update machine
        grid.machines[i] = { point: { ...normalizedPoint }, dir: newDirection, lastChange: normalizeSingle(ruleOutput.dir, grid.system.numDirs) }
    })

    return grid
}

export const createSpace = (system: SystemConfig): State[][] => {
    const space: State[][] = Array.from({ length: system.numRows }, () =>
        Array.from({ length: system.numCols }, () => 0)
    )
    return space
}

export const createNewGrid = (preset: Preset) => {

    return {
        system: preset.systemConfig,
        machines: preset.machines,
        space: createSpace(preset.systemConfig)
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