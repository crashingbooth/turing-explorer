import * as Machine from './Machine';

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
    // return {
    //     state: stateDir.state + 1 ,
    //     dir: stateDir.state % 2 === 0 ? stateDir.state  + 1 : stateDir.dir + 1  
    // }
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
    numStates: 4,
    sides: Machine.Sides.Three,
    // rule: Machine.langtonsAntFactory([-1,-1,1,1])
    rule: Machine.langtonsAntFactory([-1,-1,1,1])
}