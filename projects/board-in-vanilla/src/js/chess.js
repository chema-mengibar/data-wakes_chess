import { rows, cols, fenBase, flankQ, flankK, white, black, figures } from './chess/chess-const.js';
import Utils from './chess/chess-utils.js';
import Squares from './chess/chess-squares.js';

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
        this.mapCells = Utils.createCellsMap(rows, cols);

        const fenStr = ('fen' in config) ? config.fen : fenBase;
        this.fenToMap(fenStr);

        this.printBoardHtml().then(
            response => {
                if (this.config.asLines) {
                    document.getElementById("chess0").classList.add('asLines');
                }
                document.getElementById("chess0").innerHTML = response;
                this.paintArtist();
            }
        )
    }


    fenToMap(fen) {
        if (!fen || fen === '') {
            return
        }
        const fenAsObj = Utils.parseFenStrToObject(fen)
        this.mapCells = new Map(Object.entries(fenAsObj));
    }


    setFigureInCell(cellKey, letter, color = white) {
        this.mapCells.set(cellKey, Utils.asSquare(letter, color));
    }


    async printBoardHtml() {
        let htmlTable = '';
        rows.forEach((row) => {
            let htmlRow = `<div class="chess-row" data-row="${row}">`;
            cols.forEach((col) => {
                const squareName = Utils.getCellKey(col, row);
                const cellFigure = this.mapCells.get(squareName);

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

    paint(listCells) {
        this.paintClearCells();
        listCells.forEach(cellKey => {
            console.log(cellKey);
            document.getElementById(cellKey).style.backgroundColor = 'red';
        })
    }

    paintClearCells() {
        // let color = white;
        // this.mapCells.forEach((cellValue, cellKey) => {
        //     document.getElementById(cellKey).style.backgroundColor = color ? 'white' : 'green';
        //     color = !color;
        // })
    }

    paintArtist() {
        // document.getElementById('e4').classList.add('with-move-last');
        // document.getElementById('f3').classList.add('with-move-last');

        // document.getElementById('f5').classList.add('with-move-ok');

        // document.getElementById('f8').classList.add('with-move-error');

        // document.getElementById('d5').classList.add('with-domain-white');
        // document.getElementById('d7').classList.add('with-domain-black');

        // document.getElementById('d4').classList.add('with-accent-white');
        // document.getElementById('d6').classList.add('with-accent-black');

        // document.getElementById('e3').classList.add('with-anotation')
        // document.getElementById('e3').setAttribute('data-anotation', '!?');


        // const cellsd5 = this.getOptionfromCell('d5');
        // cellsd5.forEach(cellKey => {
        //     document.getElementById(cellKey).classList.add('with-domain-white');
        // })

        // const cellsf5 = this.getOptionfromCell('f5');
        // cellsf5.forEach(cellKey => {
        //     document.getElementById(cellKey).classList.add('with-domain-black');
        // })



        const cellsW = [
            ...this.getOptionfromCell('a2'),
            ...this.getOptionfromCell('b2'),
            ...this.getOptionfromCell('b3'),
            ...this.getOptionfromCell('e3'),
            ...this.getOptionfromCell('d5'),
            ...this.getOptionfromCell('g4'),
            ...this.getOptionfromCell('e6'),
            ...this.getOptionfromCell('f2'),
            ...this.getOptionfromCell('e5'),
            ...this.getOptionfromCell('d4'),
        ];

        cellsW.forEach(cellKey => {
            document.getElementById(cellKey).classList.add('with-domain-white');
        })

        const cellsB = [
            ...this.getOptionfromCell('a7'),
            ...this.getOptionfromCell('b7'),
            ...this.getOptionfromCell('c7'),
            ...this.getOptionfromCell('f8'),
            ...this.getOptionfromCell('f5'),
            ...this.getOptionfromCell('h5'),
            ...this.getOptionfromCell('f3'),
        ];

        cellsB.forEach(cellKey => {
            document.getElementById(cellKey).classList.add('with-domain-black');
        })
    }


    getOptionfromCell(squareName) {

        const options = [];
        const squareNameParts = squareName.split('');

        const squareColumnLetter = squareNameParts[0];
        const squareRowNumber = parseInt(squareNameParts[1], 10);

        const { letter, color } = this.mapCells.get(squareName); // letter, color

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


    analyzeCountFiguresInFlank(targetColor = white, targetFlankLetter = 'k') {

        const cellsMatched = [];

        const countFigures = Array.from(this.mapCells).filter((cellEntry) => {

            const cellName = cellEntry[0];
            const mapEntryKeyParts = cellName.split(''); // a1
            const mapEntryKeyCol = mapEntryKeyParts[0]; // a
            // const mapEntryKeyRow = mapEntryKeyParts[1]; // 1

            const mapEntryValue = cellEntry[1];

            const targetFlankColsList = targetFlankLetter === 'q' ? flankQ : flankK;

            if (
                mapEntryValue &&
                mapEntryValue.color === targetColor &&
                targetFlankColsList.includes(mapEntryKeyCol)
            ) {
                cellsMatched.push(cellName)
                return true;
            }
            return false;

        }).length;

        this.paint(cellsMatched)
        return countFigures;
    }
}