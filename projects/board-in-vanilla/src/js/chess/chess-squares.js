import { cols } from './chess-const.js';
import Utils from './chess-utils.js';


function getSquaresOptionsFromSquareWithR(
    squareColumLetter,
    squareRowNumber
) {
    const currentColumnIdx = cols.indexOf(squareColumLetter);
    const squares = [];
    for (let y = squareRowNumber - 1; y >= 1; y--) {
        squares.push(Utils.getCellKey(squareColumLetter, y));
    }
    for (let y = squareRowNumber + 1; y <= 8; y++) {
        squares.push(Utils.getCellKey(squareColumLetter, y));
    }
    for (let x = currentColumnIdx + 1; x < cols.length; x++) {
        squares.push(Utils.getCellKey(cols[x], squareRowNumber));
    }
    for (let x = currentColumnIdx - 1; x >= 0; x--) {
        squares.push(Utils.getCellKey(cols[x], squareRowNumber));
    }
    return squares;
}


function getSquaresOptionsFromSquareWithN(
    squareColumLetter,
    squareRowNumber
) {
    const currentColumnIdx = cols.indexOf(squareColumLetter);
    const squares = [];
    const nCombisYX = [
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
    ];
    nCombisYX.forEach((yx) => {
        const y = squareRowNumber + yx[0];
        const x = currentColumnIdx + yx[1];
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            squares.push(Utils.getCellKey(cols[x], y));
        }
    })
    return squares;
}


function getSquaresOptionsFromSquareWithP(
    squareColumLetter,
    squareRowNumber,
    color
) {
    const currentColumnIdx = cols.indexOf(squareColumLetter);
    const squares = [];
    const cellY = color ? squareRowNumber + 1 : squareRowNumber - 1;
    const pCombis = [
        [1, cellY],
        [-1, cellY]
    ];
    pCombis.forEach((xy) => {
        const x = currentColumnIdx + xy[0];
        const y = xy[1];
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            squares.push(Utils.getCellKey(cols[x], y));
        }
    });
    return squares;
}


function getSquaresOptionsFromSquareWithB(
    squareColumLetter,
    squareRowNumber,
) {
    const currentColumnIdx = cols.indexOf(squareColumLetter);
    const squares = [];
    let xInc = 1;
    for (let y = squareRowNumber - 1; y >= 0; y--) {
        const x = currentColumnIdx + xInc;
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            const targetSquare = Utils.getCellKey(cols[x], y);
            squares.push(targetSquare)
            xInc++;
            // if (!this.mapCells.get(targetSquare)) {
            //     break;
            // }
        }
    }
    xInc = 1;
    for (let y = squareRowNumber - 1; y >= 0; y--) {
        const x = currentColumnIdx - xInc;
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            const targetSquare = Utils.getCellKey(cols[x], y);
            squares.push(Utils.getCellKey(cols[x], y))
            xInc++;
            // if (!this.mapCells.get(targetSquare)) {
            //     // not break hear, next square
            //     // break;
            // }
        }
    }
    xInc = 1;
    for (let y = squareRowNumber + 1; y <= 8; y++) {
        const x = currentColumnIdx - xInc;
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            squares.push(Utils.getCellKey(cols[x], y))
            xInc++;
        }
    }
    xInc = 1;
    for (let y = squareRowNumber + 1; y <= 8; y++) {
        const x = currentColumnIdx + xInc;
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            squares.push(Utils.getCellKey(cols[x], y))
            xInc++;
        }
    }
    return squares;
}


function getSquaresOptionsFromSquareWithK(
    squareColumLetter,
    squareRowNumber,
) {
    const currentColumnIdx = cols.indexOf(squareColumLetter);
    const squares = [];
    const kCombisXY = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
    ];
    kCombisXY.forEach((xy) => {
        const x = currentColumnIdx + xy[0];
        const y = squareRowNumber + xy[1];
        if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
            squares.push(Utils.getCellKey(cols[x], y))
        }
    });
    return squares;
}

export default {
    getSquaresOptionsFromSquareWithR,
    getSquaresOptionsFromSquareWithN,
    getSquaresOptionsFromSquareWithP,
    getSquaresOptionsFromSquareWithB,
    getSquaresOptionsFromSquareWithK
}