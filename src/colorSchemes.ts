import  {ColorScheme } from './drawing';

export const scheme1: ColorScheme = [
    [0, 0, 0],
    [192, 202, 173],
    [157, 169, 160],
    [101, 76, 79],
    [178, 110, 99],
    [101, 76, 79]
]


export const scheme2: ColorScheme = [
    [0, 0, 0],
    [108, 88, 76],
    [157, 169, 160],
    [123, 143, 75],
    [108, 88, 76],
    [221, 229, 182],
    [173, 193, 120],
    [221, 229, 182]
]

export const blackGreyRed: ColorScheme = [
    [8, 7, 5],
    [64, 67, 78],
    [112, 38, 50],
    [166, 117, 71],
]

export const redToBrown: ColorScheme = [
    [0,10,0],
    [120, 1, 22],
    [247, 181, 56],
    [219, 124, 38],
    [216, 87, 42],
    [195, 47, 39],
]

export const whiteBlack: ColorScheme = [
    [255,255,255],
    [216, 87, 42]
]


export const whiteAndOther: ColorScheme = [
    [255,255,255],
    [216, 87, 42]
]



export const blackAndWhite = (numStates: number): ColorScheme => {
    const interval = 255 / numStates
    return Array.from({ length: numStates }, (_, index) => {
        const val = Math.floor(index * interval)
        return [val, val, val]
    })
} 