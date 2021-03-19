const rows = [8, 7, 6, 5, 4, 3, 2, 1];
const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const fenBase = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

class Figure {
    constructor(config) {
        this.letterW = config.letterW
        this.iconW = config.iconW;
        this.letterB = config.letterB;
        this.iconB = config.iconB;
    }

    asLetter(color = true) {
        if (color) {
            return this.letterW;
        }
        return this.letterB;
    }

    asIcon(color = true) {
        if (color) {
            return this.iconW;
        }
        return this.iconB;
    }
}


export default class Chess {

    constructor(config) {

        this.config = {
            asIcon: ('asIcon' in config) ? config.asIcon : true,
        }

        this.mapCells = this.createCellsMap();
        this.figures = this.buildFigures();

        const fenStr = ('fen' in config) ? config.fen : fenBase;
        this.fenParser(fenStr);

        this.boardHtml = this.printBoardHtml();
    }


    buildFigures() {
        return {
            b: new Figure({ letterW: 'B', iconW: '♗', letterB: 'b', iconB: '♝' }),
            r: new Figure({ letterW: 'R', iconW: '♖', letterB: 'r', iconB: '♜' }),
            n: new Figure({ letterW: 'N', iconW: '♘', letterB: 'n', iconB: '♞' }),
            k: new Figure({ letterW: 'K', iconW: '♔', letterB: 'k', iconB: '♚' }),
            q: new Figure({ letterW: 'Q', iconW: '♕', letterB: 'q', iconB: '♛' }),
            p: new Figure({ letterW: 'P', iconW: '♙', letterB: 'p', iconB: '♟' }),
        };
    }

    fenParser(fen) {

        if (!fen || fen === '') {
            return
        }

        const allowedLetters = ['r', 'n', 'b', 'k', 'q', 'p', 'R', 'N', 'B', 'K', 'Q', 'P'];
        const fenRowsSeparator = ' ';

        const figuresPart = fen.split(fenRowsSeparator)[0];
        const strRows = figuresPart.split('/');

        strRows.forEach((rowText, rowIdw) => {
            const boardRowIdx = 8 - rowIdw; // to flip the board ->  rowIdw + 1
            let currentCol = 1;
            rowText.split('').forEach((character) => {
                if (allowedLetters.includes(character)) {
                    // it´s a figure letter
                    const colLetter = cols[currentCol - 1];
                    const cellKey = this.getCellKey(colLetter, boardRowIdx);
                    const color = (character == character.toUpperCase()); // R -> true
                    const figureLetter = character.toLowerCase();
                    this.setFigureInCell(cellKey, figureLetter, color);
                    currentCol += 1;

                } else {
                    // should be a number
                    const jumpCols = parseInt(character, 10)
                    for (let c = currentCol; c < jumpCols + currentCol; c++) {
                        const colLetter = cols[c - 1];
                        const cellKey = this.getCellKey(colLetter, boardRowIdx);
                        this.setFigureInCell(cellKey, null);
                    }
                    currentCol += parseInt(character, 10);
                }
            })
        });



    }

    getCellKey(colLetter, rowNumber) {
        return `${colLetter}${rowNumber}`;
    }

    setFigureInCell(cellKey, letter, color = true) {
        if (letter) {
            this.mapCells.set(cellKey, {
                letter: letter,
                color: color,
            });
        } else {
            this.mapCells.set(cellKey, null);
        }

    }

    createCellsMap() {
        const listCells = [];
        rows.forEach((row) => {
            cols.forEach((col) => {
                const cellKey = this.getCellKey(col, row);
                listCells.push([cellKey, null]);
            })
        })
        return new Map(listCells);
    }

    printBoardHtml() {
        let htmlTable = '';
        rows.forEach((row) => {
            let htmlRow = `<div class="chess-row" data-row="${row}">`;
            cols.forEach((col) => {
                const cellKey = this.getCellKey(col, row);
                const cellFigure = this.mapCells.get(cellKey);
                let figureText = ' ';
                const cssClasses = [];
                if (cellFigure) {

                    const figure = this.figures[cellFigure.letter];
                    if (this.config.asIcon === true) {
                        figureText = figure.asIcon(cellFigure.color);
                    } else {
                        figureText = figure.asLetter(cellFigure.color);
                    }

                    if (this.config.asIcon) {
                        cssClasses.push('as-icon');
                    }

                    if (this.config.asIcon === false && cellFigure.color) {
                        cssClasses.push('as-text-white');
                    } else if (this.config.asIcon === false && !cellFigure.color) {
                        cssClasses.push('as-text-black');
                    }
                }



                let htmlCol = `<div id="${cellKey}" title="${cellKey}" class="chess-col ${  cssClasses.join(' ') }" data-col="${col}" data-square="${cellKey}">${figureText}</div>`;
                htmlRow += htmlCol;
            })
            htmlRow += '</div>';
            htmlTable += htmlRow;
        })
        return htmlTable
    }
}