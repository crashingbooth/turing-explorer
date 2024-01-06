import * as M from './Machine';
import { WebMidi } from "webmidi";

export interface SoundPlayer {
    channel: number,
    mapping: number[],
    ignoreZero: boolean,
    rearticulateOnRepeat: boolean,
    rootNote: number,
    duration: number,
    lastInput?: number,
}

const makeNoise = (inputValue: number, soundPlayer: SoundPlayer) => {
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
}

const articulateState = (grid: M.Grid, machine: M.Machine) => {
    const state = grid.space[machine.point.y][machine.point.x]
    makeNoise(state, grid.statePlayer)
}

const articulateDir = (grid: M.Grid, machine: M.Machine) => {
    makeNoise(machine.dir, grid.dirPlayer)
}

export const articulate = (grid: M.Grid) => {
    for (let machine of grid.machines) {
        if (grid.statePlayer) {
            articulateState(grid, machine)
        }

        if (grid.dirPlayer) {
            articulateDir(grid, machine)
        }
    }
}

export const addSoundPlayers: (grid: M.Grid) => M.Grid = (grid: M.Grid) => {
    return {
        ...grid,
        statePlayer: {
            channel: 1,
            mapping: [-2, 0, 3, 5, 7, 10],
            ignoreZero: false,
            rearticulateOnRepeat: false,
            rootNote: 48,
            duration: 200
        },
        dirPlayer: {
            channel: 2,
            mapping: [0, 1, 2, 3],
            ignoreZero: false,
            rearticulateOnRepeat: false,
            rootNote: 48,
            duration: 200
        }
    }
}

