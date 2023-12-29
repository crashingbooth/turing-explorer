import * as Machine from './Machine';

const myRule: Machine.Rule = (stateDir) => {
    // switch (stateDir.state) {
    //     case 0:
    //         return {
    //             state: 1,
    //             dir: stateDir.dir + 1   
    //                  }
    //         break;
    //     case 1:
    //         return {
    //             state: 3,
    //             dir: stateDir.state + 1
    //         }
    //         break;
    //     case 2:
    //         break;
    //     case 3:
    //         break;
    // }
    return {
        state: stateDir.state + 1 ,
        dir: stateDir.state % 2 === 0 ? stateDir.state  + 1 : stateDir.dir + 1  
    }
}

export const mySystem: Machine.SystemConfig = {
    numDirs: 4,
    numCols: 96,
    numRows: 72,
    numStates: 4,
    rule: myRule
}