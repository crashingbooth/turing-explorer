import * as Machine from './Machine';
import { scheme2 } from './colorSchemes';
import { DrawConfig, generateDrawConfig } from './drawing';
import { SoundPlayer } from './sound';

export interface Preset {
    systemConfig: Machine.SystemConfig
    drawConfig: DrawConfig,
    machines?: [Machine.Machine],
    bpm: number,
    statePlayer?: SoundPlayer,
    dirPlayer?: SoundPlayer
}

const myRule: Machine.Rule = (stateDir) => {
    const newState = stateDir.state + 1
    switch (stateDir.state) {
        case 0:
            return {
                state: newState,
                dir: (stateDir.state % 2 === 0) ? 1 : -1
            }
            break;
        case 1:
            return {
                state: newState,
                dir: (stateDir.state % 2 === 0) ? 1 : -1
            }
            break;
        case 2:
            return {
                state: newState,
                dir: (stateDir.state % 2 === 0) ? 1 : -2
            }
            break;
        case 3:
            return {
                state: newState,
                dir: (stateDir.state % 2 === 0) ? 1 : -1
            }
            break;
    }
}

export const mySystem: Machine.SystemConfig = {
    numDirs: 4,
    numCols: 32,
    numRows: 32,
    numStates: 4,
    sides: Machine.Sides.Four,
    rule: myRule
}



export const triSystem: Machine.SystemConfig = {
    numDirs: 6,
    numCols: 32,
    numRows: 24,
    numStates: 8,
    sides: Machine.Sides.Three,
    rule: Machine.langtonsAntFactory([-1, -1, 1, 1, -1, -1, 1, 1])
}

export const triSystem2: Machine.SystemConfig = {
    numDirs: 6,
    numCols: 36,
    numRows: 12,
    numStates: 4,
    sides: Machine.Sides.Three,
    rule: Machine.langtonsAntFactory([1, 3, 3, -1])
}

export const triSystemPreset = (): Preset => {
    const drawConfig = generateDrawConfig(triSystem2, scheme2)
    return {
        systemConfig: triSystem2,
        drawConfig: drawConfig,
        machines: drawConfig.defaultMachineStart,
        bpm: 145,
        statePlayer: {
            channel: 1,
            mapping: [0, 2, 5, 7, 10],//[0,2,7,10,12,14,3],
            ignoreZero: false,
            rearticulateOnRepeat: false,
            rootNote: 40,
            duration: 200
        },
        dirPlayer: {
            channel: 2,
            mapping: [0, 2, 3, 5, 7, 10],
            ignoreZero: false,
            rearticulateOnRepeat: false,
            rootNote: 64,
            duration: 200
        },
    }
}