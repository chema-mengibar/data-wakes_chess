import { rows, cols, fenBase, flankQ, flankK, white, black, figures } from './chess/chess-const.js';
import Utils from './chess/chess-utils.js';
import Squares from './chess/chess-squares.js';
import ChessControls from './chess/chess-controls.js';

export default class Chess {

    constructor(config) {
        // Init
        this.config = {
            asIcon: ('asIcon' in config) ? config.asIcon : true,
            asLines: ('asLines' in config) ? config.asLines : true,
        }

        this.figures = figures;
        this.colors = {
            white: white,
            black: black,
        };

        // Run
        this.squaresMap = Utils.createCellsMap(rows, cols);

        const fenStr = ('fen' in config) ? config.fen : fenBase;
        this.fenToMap(fenStr);
        this.render();

        this.chessControls = new ChessControls(this.chessActions);
    }

    get chessActions() {
        const self = this;
        return {
            onAdd: (square, letter, color) => {
                self.setFigureInSquare(square, letter, color);
                self.render();
            }
        }
    }

    async render() {
        return this.printBoardHtml().then(
            response => {
                if (this.config.asLines) {
                    document.getElementById("chess0").classList.add('asLines');
                }
                document.getElementById("chess0").innerHTML = response;
                this.chessControls.squareControls();
                // this.artist();
            }
        )
    }
    fenToMap(fen) {
        if (!fen || fen === '') {
            return
        }
        const fenAsObj = Utils.parseFenStrToObject(fen)
        this.squaresMap = new Map(Object.entries(fenAsObj));
    }


    setFigureInSquare(squareName, letter, color = white) {
        this.squaresMap.set(squareName, Utils.asSquare(letter, color));
    }


    async printBoardHtml() {
        let htmlTable = '';
        rows.forEach((row) => {
            let htmlRow = `<div class="chess-row" data-row="${row}">`;
            cols.forEach((col) => {
                const squareName = Utils.getCellKey(col, row);
                const cellFigure = this.squaresMap.get(squareName);

                let figureText = ' ';
                const cssClasses = [];
                if (cellFigure) {

                    const selectedFigure = figures[cellFigure.letter];
                    if (this.config.asIcon === true) {
                        figureText = selectedFigure.asIcon(cellFigure.color);
                    } else {
                        figureText = selectedFigure.asLetter(cellFigure.color);
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
                const htmlCol = `<div id="${squareName}" title="${squareName}" class="chess-square ${  cssClasses.join(' ') }" data-col="${col}" data-square="${squareName}">${figureText}</div>`;
                htmlRow += htmlCol;
            })
            htmlRow += '</div>';
            htmlTable += htmlRow;
        })
        return htmlTable
    }

    getOptionfromCell(squareName) {

        const options = [];
        const squareNameParts = squareName.split('');

        const squareColumnLetter = squareNameParts[0];
        const squareRowNumber = parseInt(squareNameParts[1], 10);

        const { letter, color } = this.squaresMap.get(squareName);

        if (letter === 'r') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithR(squareColumnLetter, squareRowNumber);
            options.push(...squareOptions);
        }
        if (letter === 'n') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithN(squareColumnLetter, squareRowNumber);
            options.push(...squareOptions);
        }
        if (letter === 'p') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithP(squareColumnLetter, squareRowNumber, color);
            options.push(...squareOptions);
        }
        if (letter === 'b') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithB(squareColumnLetter, squareRowNumber);
            options.push(...squareOptions);
        }
        if (letter === 'q') {
            const squareOptionsVertHorz = Squares.getSquaresOptionsFromSquareWithR(squareColumnLetter, squareRowNumber);
            const squareOptionsDiagonal = Squares.getSquaresOptionsFromSquareWithB(squareColumnLetter, squareRowNumber);
            options.push(...squareOptionsVertHorz, ...squareOptionsDiagonal);
        }
        if (letter === 'k') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithK(squareColumnLetter, squareRowNumber);
            options.push(...squareOptions);
        }
        return options;
    }

    artist() {
        // White domain
        const squaresInWhiteDomain = []
        this.squaresMap.forEach((squareEntry, squareName) => {
            if (squareEntry && squareEntry.color === white) {
                const squaresFromFigure = this.getOptionfromCell(squareName)
                squaresInWhiteDomain.push(...squaresFromFigure)
            }
        })
        squaresInWhiteDomain.forEach(squareName => {
            document.getElementById(squareName).classList.add('with-domain-white');
        })

        // Black domain
        const squaresInBlackDomain = []
        this.squaresMap.forEach((squareEntry, squareName) => {
            if (squareEntry && squareEntry.color === black) {
                const squaresFromFigure = this.getOptionfromCell(squareName)
                squaresInBlackDomain.push(...squaresFromFigure)
            }
        })
        squaresInBlackDomain.forEach(squareName => {
            document.getElementById(squareName).classList.add('with-domain-black');
        })



    }



}