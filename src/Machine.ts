import { WebMidi } from "webmidi";
import * as p5 from 'p5';

type State = number

type StateDir = {
    state: State,
    dir: number
}

type Rule = (initial: StateDir) => StateDir

interface Point {
    x: number
    y: number
}

interface System {
    numRows: number
    numCols: number
    numStates: number
    rule: Rule
}

const normalize = (point: Point, system: System): Point => {
    const normalizeSingle = (val: number, max: number): number => {
        let newVal = val < 0 ? max - val : val
        return val >= max ? (val % max) : newVal
    }
    return {
        x: normalizeSingle(point.x, system.numCols),
        y: normalizeSingle(point.y, system.numRows)
    }
}

interface Machine {
    point: Point
    stateDir: StateDir
}

interface Grid {
    system: System
    machines: Machine[]
    space: State[][]
}


