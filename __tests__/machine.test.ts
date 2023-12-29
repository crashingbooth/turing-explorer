import * as Machine from '../src/Machine';


test('movePoint', () => {
    const p1 = {x: 1, y: 2}
    expect(Machine.movePoint(p1, 0)).toEqual({x: 1, y:1})
    expect(Machine.movePoint(p1, 1)).toEqual({x: 2, y:2})
    expect(Machine.movePoint(p1, 2)).toEqual({x: 1, y:3})
    expect(Machine.movePoint(p1, 3)).toEqual({x: 0, y:2})
})

test('movePoint with dir higher than 4', () => {
    const p1 = {x: 1, y: 2}
    expect(Machine.movePoint(p1, 4)).toEqual({x: 1, y:1})
    expect(Machine.movePoint(p1, 5)).toEqual({x: 2, y:2})
    expect(Machine.movePoint(p1, 6)).toEqual({x: 1, y:3})
    expect(Machine.movePoint(p1, 7)).toEqual({x: 0, y:2})
})

test('movePoint with dir less than 0', () => {
    const p1 = {x: 1, y: 2}
    expect(Machine.movePoint(p1, -4)).toEqual({x: 1, y:1})
    expect(Machine.movePoint(p1, -3)).toEqual({x: 2, y:2})
    expect(Machine.movePoint(p1, -2)).toEqual({x: 1, y:3})
    expect(Machine.movePoint(p1, -1)).toEqual({x: 0, y:2})
})

const fourRowsEightsCols: Machine.SystemConfig = {
    numRows: 4,
    numCols: 8, 
    numStates: 4,
    numDirs: 4,
    rule: (stateDir: Machine.StateDir) => stateDir // unused here
}

test('normalize top', () => {
    const p1 = {x: 0, y: -1}
    expect(Machine.normalizePoint(p1, fourRowsEightsCols)).toEqual( {x: 0, y: 3 } )
})

test('normalize bottom', () => {
    const p1 = {x: 0, y: 4}
    expect(Machine.normalizePoint(p1, fourRowsEightsCols)).toEqual( {x: 0, y: 0 } )
})

test('normalize left', () => {
    const p1 = {x: -1, y: 0}
    expect(Machine.normalizePoint(p1, fourRowsEightsCols)).toEqual( {x: 7, y: 0 } )
})

test('normalize right', () => {
    const p1 = {x: 8, y: 0}
    expect(Machine.normalizePoint(p1, fourRowsEightsCols)).toEqual( {x: 0, y: 0 } )
})


test('normalize rule output', () => {
    const stateDir = {
        state: 4,
        dir: 4
    }
    expect(Machine.normalizeRuleOutput(stateDir, fourRowsEightsCols)).toEqual({state: 0, dir: 0})
})

// Apply rule
const fourByFourLangtons = {numRows: 4, numCols: 4, numStates: 2, numDirs: 4, rule: Machine.langtonsAntFactory([1,-1])}
const startingMachine = {point: {x: 1, y:1}, dir: 0}

const createNewGrid: () => Machine.Grid = () => {
    return {
        system: fourByFourLangtons,
        machines: [startingMachine],
        space: Machine.createSpace(fourByFourLangtons)
    }
}

test('apply langtons ant once', () => {
    const applyLAOnce = Machine.applyRule(createNewGrid())

    // new machine
    expect(applyLAOnce.machines).toEqual([{point: {x: 1, y:0}, dir: 1}])
    let newSpace = Machine.createSpace(fourByFourLangtons)
    newSpace[0][1] = 1
    expect(applyLAOnce.space).toEqual(newSpace)
})

test('apply langtons ant twice', () => {
    const applyOnce = Machine.applyRule(createNewGrid())
    const applyTwice = Machine.applyRule(applyOnce)

    // new machine
    expect(applyTwice.machines).toEqual([{point: {x: 2, y:0}, dir: 2}])
    let newSpace = Machine.createSpace(fourByFourLangtons)
    newSpace[0][1] = 1
    newSpace[0][2] = 1
    expect(applyTwice.space).toEqual(newSpace)
})

test('apply langtons step 3', () => {
    const applyOnce = Machine.applyRule(createNewGrid())
    const applyTwice = Machine.applyRule(applyOnce)
    const apply3Times = Machine.applyRule(applyTwice)

    // new machine
    expect(apply3Times.machines).toEqual([{point: {x: 2, y:1}, dir: 3}])
    let newSpace = Machine.createSpace(fourByFourLangtons)
    newSpace[0][1] = 1
    newSpace[0][2] = 1
    newSpace[1][2] = 1
    expect(apply3Times.space).toEqual(newSpace)
})

test('apply langtons step 4', () => {
    const applyOnce = Machine.applyRule(createNewGrid())
    const applyTwice = Machine.applyRule(applyOnce)
    const apply3Times = Machine.applyRule(applyTwice)
    const apply4Times = Machine.applyRule(apply3Times)

    // new machine
    expect(apply4Times.machines).toEqual([{point: {x: 1, y:1}, dir: 0}])
    let newSpace = Machine.createSpace(fourByFourLangtons)
    newSpace[0][1] = 1
    newSpace[0][2] = 1
    newSpace[1][2] = 1
    newSpace[1][1] = 1
    expect(apply4Times.space).toEqual(newSpace)
})

test('apply langtons step 5', () => {
    const applyOnce = Machine.applyRule(createNewGrid())
    const applyTwice = Machine.applyRule(applyOnce)
    const apply3Times = Machine.applyRule(applyTwice)
    const apply4Times = Machine.applyRule(apply3Times)
    const apply5Times = Machine.applyRule(apply4Times)

    // new machine
    expect(apply5Times.machines).toEqual([{point: {x: 1, y:0}, dir: 3}])
    let newSpace = Machine.createSpace(fourByFourLangtons)
    // newSpace[0][1] = 1
    newSpace[0][2] = 1
    newSpace[1][2] = 1
    newSpace[1][1] = 1
    newSpace[0][1] = 0
    expect(apply5Times.space).toEqual(newSpace)
})

