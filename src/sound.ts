import { Grid, Machine } from './Machine';
import { WebMidi } from "webmidi";
import { Preset }  from './presets'


export interface SoundPlayer {
    channel: number,
    mapping: number[],
    ignoreZero: boolean,
    rearticulateOnRepeat: boolean,
    rootNote: number,
    duration: number,
    lastInput?: number,
    debugToConsole?: boolean
}

const makeNoise = (inputValue: number, soundPlayer: SoundPlayer, name: string) => {
    if (inputValue === soundPlayer.lastInput && !soundPlayer.rearticulateOnRepeat) {
        return
    }
    soundPlayer.lastInput = inputValue
    if (soundPlayer.ignoreZero) {
        if (inputValue == 0) {
            return
        } else {
            inputValue = inputValue - 1
        }
    }

    const octaveSize = Math.floor(soundPlayer.mapping[soundPlayer.mapping.length - 1] / 12) + 1
    const octave = Math.floor(inputValue / soundPlayer.mapping.length)
    const note = soundPlayer.mapping[(inputValue % soundPlayer.mapping.length)] + 12 * octave * octaveSize + soundPlayer.rootNote
    WebMidi.outputs[0].channels[soundPlayer.channel].playNote(note, { duration: soundPlayer.duration })

    if (soundPlayer.debugToConsole ?? false) {
        console.log(`${name} - ch: ${soundPlayer.channel}, note: ${note} (input: ${inputValue})`)
    }
}

const articulateState = (grid: Grid, machine: Machine) => {
    const state = grid.space[machine.point.y][machine.point.x]
    makeNoise(state, grid.statePlayer, "statePlayer")
}

const articulateDir = (grid: Grid, machine: Machine) => {
    makeNoise(machine.dir, grid.dirPlayer, "dirPlayer")
}

const articulateChange = (grid: Grid, machine: Machine) => {
    makeNoise(machine.lastChange, grid.changePlayer, "changePlayer")
}

export const articulate = (grid: Grid) => {
    for (let machine of grid.machines) {
        if (grid.statePlayer) {
            articulateState(grid, machine)
        }

        if (grid.dirPlayer) {
            articulateDir(grid, machine)
        }

        if (grid.changePlayer) {
            articulateChange(grid, machine)
        }
    }
}

export const bpmToFrameRate = (bpm: number): number => {
    // assume four events per beat
    return bpm * 4 / 60
}

export const addSoundPlayersFromPreset = (grid: Grid, preset: Preset): Grid => {
    return { ...grid,
        statePlayer: preset.statePlayer,
        dirPlayer: preset.dirPlayer,
        changePlayer: preset.changePlayer
    } 
}

