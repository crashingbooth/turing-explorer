import * as Machine from './Machine';
import { blackAndWhite, scheme2, blackGreyRed, redToBrown } from './colorSchemes';
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

// export const repeatSystem = ()

export const mySystem = () : Machine.SystemConfig => {
    return {
        numDirs: 4,
    numCols: 32,
    numRows: 32,
    numStates: 4,
    sides: Machine.Sides.Four,
    rule: Machine.langtonsAntFactory([-1, -1, 1, 1, -1, -1, 1, 1])
}
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
    const drawConfig = generateDrawConfig(triSystem2, blackGreyRed, 60)
    return {
        systemConfig: triSystem2,
        drawConfig: drawConfig,
        machines: drawConfig.defaultMachineStart,
        bpm: 140,
        statePlayer: {
            channel: 1,
            mapping: [0, 2, 5, 7, 10],//[0,2,7,10,12,14,3],
            ignoreZero: false,
            rearticulateOnRepeat: false,
            rootNote: 28,
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

export const triangleLangton = (numRepeats: number, rule: number[]):Machine.SystemConfig => { 
    return {
    numDirs: 6,
    numCols: 48,
    numRows: 28,
    numStates: 2 * numRepeats,
    sides: Machine.Sides.Three,
    rule: Machine.langtonsAntFactory(
        Array.from({length: numRepeats}, () => rule).flat()
        )  
}
}

const run = (n: number): number[] => {
    return Array.from({ length: n }, (_, index) => index)
}

const nameOrderedScale = [0,7,10,12,14,3]

export const triangleLangtonPreset = (generator:  Machine.SystemConfig): Preset => {
    const drawConfig = generateDrawConfig(generator, blackAndWhite(generator.numStates + 2), 100, 500)
    return {
        systemConfig: generator,
        drawConfig: drawConfig,
        machines: drawConfig.defaultMachineStart,
        bpm: 120,
        statePlayer: {
            channel: 1,
            mapping: nameOrderedScale,//[0,2,7,10,12,14,3],
            ignoreZero: true,
            rearticulateOnRepeat: false,
            rootNote: 40,
            duration: 150
        },
        dirPlayer: {
            channel: 2,
            mapping: nameOrderedScale,//nameOrderedScale,//[0, 2, 3, 5, 7, 10],
            ignoreZero: false,
            rearticulateOnRepeat: true,
            rootNote: 52,
            duration: 200
        },
    }
}

export const triangleLangtonBasic = triangleLangtonPreset(triangleLangton(3, [-1,1]))

