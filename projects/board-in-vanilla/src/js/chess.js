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


const rows = [8, 7, 6, 5, 4, 3, 2, 1];
const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const fenBase = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const figures = {
    b: new Figure({ letterW: 'B', iconW: '♗', letterB: 'b', iconB: '♝' }),
    r: new Figure({ letterW: 'R', iconW: '♖', letterB: 'r', iconB: '♜' }),
    n: new Figure({ letterW: 'N', iconW: '♘', letterB: 'n', iconB: '♞' }),
    k: new Figure({ letterW: 'K', iconW: '♔', letterB: 'k', iconB: '♚' }),
    q: new Figure({ letterW: 'Q', iconW: '♕', letterB: 'q', iconB: '♛' }),
    p: new Figure({ letterW: 'P', iconW: '♙', letterB: 'p', iconB: '♟' }),
};

const flankQ = ['a', 'b', 'c', 'd', ];
const flankK = ['e', 'f', 'g', 'h', ];

const white = true;
const black = false;



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
        this.mapCells = this.createCellsMap();

        const fenStr = ('fen' in config) ? config.fen : fenBase;
        this.fenParser(fenStr);

        this.printBoardHtml().then(
            response => {
                if (this.config.asLines) {

                    document.getElementById("chess0").classList.add('asLines')
                }
                document.getElementById("chess0").innerHTML = response;
                this.paintArtist();
            }
        )


    }


    fenParser(fen) {

        if (!fen || fen === '') {
            return
        }

        const allowedLetters = ['r', 'n', 'b', 'k', 'q', 'p', 'R', 'N', 'B', 'K', 'Q', 'P'];
        const fenFiguresSeparator = ' ';
        const fenRowsSeparator = '/';

        const figuresPart = fen.split(fenFiguresSeparator)[0];
        const strRows = figuresPart.split(fenRowsSeparator);

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

    setFigureInCell(cellKey, letter, color = white) {
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

    async printBoardHtml() {
        let htmlTable = '';
        rows.forEach((row) => {
            let htmlRow = `<div class="chess-row" data-row="${row}">`;
            cols.forEach((col) => {
                const cellKey = this.getCellKey(col, row);
                const cellFigure = this.mapCells.get(cellKey);
                let figureText = ' ';
                const cssClasses = [];
                if (cellFigure) {

                    const selectedFigure = this.figures[cellFigure.letter];
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
                const htmlCol = `<div id="${cellKey}" title="${cellKey}" class="chess-square ${  cssClasses.join(' ') }" data-col="${col}" data-square="${cellKey}">${figureText}</div>`;
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

    getOptionfromCell(cellKey) {

        const options = [];
        const cellKeyProps = cellKey.split('');
        const cellCol = cellKeyProps[0];
        const cellRow = parseInt(cellKeyProps[1], 10);
        const { letter, color } = this.mapCells.get(cellKey); // letter, color
        const currentColIdx = cols.indexOf(cellCol);

        console.log(letter, cellCol, cellRow);

        if (letter === 'r' || letter === 'q') {
            for (let y = cellRow - 1; y >= 1; y--) {
                options.push(this.getCellKey(cellCol, y));
            }
            for (let y = cellRow + 1; y <= 8; y++) {
                options.push(this.getCellKey(cellCol, y));
            }
            for (let x = currentColIdx + 1; x < cols.length; x++) {
                options.push(this.getCellKey(cols[x], cellRow));
            }
            for (let x = currentColIdx - 1; x >= 0; x--) {
                options.push(this.getCellKey(cols[x], cellRow));
            }

        }
        if (letter === 'n') {
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
                const y = cellRow + yx[0];
                const x = currentColIdx + yx[1];
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    options.push(this.getCellKey(cols[x], y));
                }
            })
        }
        if (letter === 'p') {

            const cellY = color ? cellRow + 1 : cellRow - 1;
            const pCombis = [
                [1, cellY],
                [-1, cellY]
            ];
            pCombis.forEach((xy) => {
                const x = currentColIdx + xy[0];
                const y = xy[1];
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    options.push(this.getCellKey(cols[x], y));
                }
            });

        }
        if (letter === 'b' || letter === 'q') {
            let xInc = 1;
            for (let y = cellRow - 1; y >= 0; y--) {
                const x = currentColIdx + xInc;
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    const targetSquare = this.getCellKey(cols[x], y);
                    options.push(targetSquare)
                    xInc++;
                    if (!this.mapCells.get(targetSquare)) {
                        break;
                    }
                }
            }
            xInc = 1;
            for (let y = cellRow - 1; y >= 0; y--) {
                const x = currentColIdx - xInc;
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    const targetSquare = this.getCellKey(cols[x], y);
                    options.push(this.getCellKey(cols[x], y))
                    xInc++;
                    if (!this.mapCells.get(targetSquare)) {
                        // not break hear, next square
                        // break;
                    }

                }
            }
            xInc = 1;
            for (let y = cellRow + 1; y <= 8; y++) {
                const x = currentColIdx - xInc;
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    options.push(this.getCellKey(cols[x], y))
                    xInc++;
                }
            }
            xInc = 1;
            for (let y = cellRow + 1; y <= 8; y++) {
                const x = currentColIdx + xInc;
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    options.push(this.getCellKey(cols[x], y))
                    xInc++;
                }
            }
        }
        if (letter === 'k') {
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
                const x = currentColIdx + xy[0];
                const y = cellRow + xy[1];
                if (x >= 0 && x < cols.length && y > 0 && y <= 8) {
                    options.push(this.getCellKey(cols[x], y))
                }
            });
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