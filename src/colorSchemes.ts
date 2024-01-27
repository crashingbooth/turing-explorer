import { ColorScheme, PColor } from './drawing';

const hexToRGB = (hexString: string): PColor => {
    hexString = hexString.replace(/^#/, '')
    const bigint = parseInt(hexString, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

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
    [0, 10, 0],
    [120, 1, 22],
    [247, 181, 56],
    [219, 124, 38],
    [216, 87, 42],
    [195, 47, 39],
]

export const whiteBlack: ColorScheme = [
    [255, 255, 255],
    [216, 87, 42]
]

export const blueOrangeBrown: ColorScheme = [         // white
    "#2E2E3A",           // a1
    "#FBB034",           // b1
    "#BC5D2E",           // c1
    "#BBB8B2",           // d1
    "#C3340F",           // a2
    "#585862",           // b2
    "#FBE0AC",           // c2
    "#D89D82",           // d2
    "#5C5E58",           // a3
    "#631807",           // b3
    "#E5E2E2"
].map( e => hexToRGB(e))

export const col3 = ["#5B5393",           // c1
    "#7CBB92",           // d1
    "#D890AF",           // a2
    "#5B5393",           // b2
    "#4E9C68",           // c2
    "#B45A81",
    "#3A3276",
    "#297C46",           // a1
    "#90305A",  // d2
    "#201858",           // a3
    "#105D2A"].map( e => hexToRGB(e))         // b3

export const col4 = [
    "#713E5A",           // a1
    "#63A375",           // b1
    "#EDC79B",           // c1
    "#D57A66",           // d1
    "#CA6680",           // a2
    "#9B778D",           // b2
    "#93BE9F",           // c2
    "#F7E5CD",           // d2
    "#E1A193",           // a3
    "#D993A7",           // b3
    "#75634B"].map( e => hexToRGB(e))        // c3

export const whiteAndOther: ColorScheme = [
    [255, 255, 255],
    [216, 87, 42]
]



export const blackAndWhite = (numStates: number): ColorScheme => {
    const interval = 255 / numStates
    return Array.from({ length: numStates }, (_, index) => {
        const val = Math.floor(index * interval)
        return [val, val, val]
    })
} 
