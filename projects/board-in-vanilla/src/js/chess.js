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
            withLimitation: ('withLimitation' in config) ? config.withLimitation : false,
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
            },
            onClearSquare: (square) => {
                self.setFigureInSquare(square, null);
                self.render();
            },
            onClear: () => {
                self.squaresMap = Utils.createCellsMap(rows, cols);
                self.render();
            },
            onInit: () => {
                self.fenToMap(fenBase);
                self.render();
            },
            onDomainW: async() => {
                await self.render();
                // White domain
                const squaresInWhiteDomain = []
                this.squaresMap.forEach((squareEntry, squareName) => {
                    if (squareEntry && squareEntry.color === white) {
                        const squaresFromFigure = this.getOptionfromCell(squareName);
                        squaresInWhiteDomain.push(...squaresFromFigure);
                    }
                })
                squaresInWhiteDomain.forEach(squareName => {
                    document.getElementById(squareName).classList.add('with-domain-white');
                })
            },
            onDomainB: async() => {
                await self.render();
                // Black domain
                const squaresInBlackDomain = []
                self.squaresMap.forEach((squareEntry, squareName) => {
                    if (squareEntry && squareEntry.color === black) {
                        const squaresFromFigure = this.getOptionfromCell(squareName);
                        squaresInBlackDomain.push(...squaresFromFigure);
                    }
                })
                squaresInBlackDomain.forEach(squareName => {
                    document.getElementById(squareName).classList.add('with-domain-black');
                })
            },
            onDomainsHide: async() => {
                await self.render();
            }
        }
    }

    async render() {

        await this.printSvg();

        // return this.printBoardHtml().then(
        //     response => {
        //         if (this.config.asLines) {
        //             document.getElementById("chess").classList.add('asLines');
        //         }
        //         document.getElementById("chess").innerHTML = response;
        //         this.chessControls.squareControls();
        //     }
        // )
    }
    fenToMap(fen) {
        if (!fen || fen === '') {
            return
        }
        const fenAsObj = Utils.parseFenStrToObject(fen);
        this.squaresMap = new Map(Object.entries(fenAsObj));
    }


    setFigureInSquare(squareName, letter, color = white) {
        this.squaresMap.set(squareName, Utils.asSquare(letter, color));
    }


    async printSvg() {

        const svg = document.getElementById("chess-svg");

        function appendSquare(colIdx, rowIdx) {

            const boardSize = 100;

            const rowInt = 9 - (rowIdx + 1);

            const squareLetter = cols[colIdx];
            const squareName = Utils.getCellKey(squareLetter, rowInt);
            const x = (boardSize / 8) * colIdx;
            const y = (boardSize / 8) * rowIdx;

            const asIcon = true;

            const xT = asIcon ? 2 : 4;
            const yT = asIcon ? -1 : 8;
            const dyT = asIcon ? 10 : 0;

            const fig = asIcon ? '♜' : 'n';

            const content = `
                <rect class="base" width="12.5%" height="12.5%"  />
                <g class="markers" width="12.5%" height="12.5%"  fill="transparent"/>
                <text class="piece black ${ asIcon ? 'asIcon' : ''}" text-anchor="start" x="${xT}" y="${yT}" dy="${dyT}">${fig}</text>
            `;

            const squeareG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            squeareG.setAttribute('class', 'square');
            squeareG.setAttribute('id', `${squareName}`);
            squeareG.setAttribute('data-square', `${squareName}`);
            squeareG.setAttribute('data-square-col', `${squareLetter}`);
            squeareG.setAttribute('data-square-row', `${rowInt}`);
            squeareG.setAttribute('transform', `translate(${x},${y})`);

            squeareG.innerHTML = content;

            svg.appendChild(squeareG);
            
        }

        rows.forEach((_, rowIdx) => {
            cols.forEach((_, colIdx) => {
                appendSquare(colIdx, rowIdx);
            })
        })

        function addMarkerCircle(squareName, type=null){
            let typeMarker = 'neutral'
            if( type === white ){
                typeMarker = 'white';
            }else if( type === false ){
                typeMarker = 'black';
            }
            const squareNode = document.querySelectorAll(`#${squareName} .markers`)[0];
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute( 'href', `#marker-circle-${typeMarker}`);
            squareNode.appendChild(use);
        }

        function addMarkerRect(squareName, type=true){
            let typeMarker = type ? 'ok' : 'error';
               const squareNode = document.querySelectorAll(`#${squareName} .markers`)[0];
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute( 'href', `#marker-rect-${typeMarker}`);
            squareNode.appendChild(use);
        }

        function addMarkerMoveLast(squareName){
               const squareNode = document.querySelectorAll(`#${squareName} .markers`)[0];
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute( 'href', `#marker-move-last`);
            squareNode.appendChild(use);
        }



        addMarkerCircle('e6',white);
        addMarkerRect('a1');
        addMarkerMoveLast('a2');
        addMarkerRect('e6',false);
  

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

        const limitation = this.config.withLimitation;

        const options = [];
        if (!squareName) {
            return;
        }
        const squareNameParts = squareName.split('');

        const squareColumnLetter = squareNameParts[0];
        const squareRowNumber = parseInt(squareNameParts[1], 10);

        const { letter, color } = this.squaresMap.get(squareName);

        if (letter === 'r') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithR(this.squaresMap, squareColumnLetter, squareRowNumber, limitation);
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
            const squareOptions = Squares.getSquaresOptionsFromSquareWithB(this.squaresMap, squareColumnLetter, squareRowNumber, limitation);
            options.push(...squareOptions);
        }
        if (letter === 'q') {
            const squareOptionsVertHorz = Squares.getSquaresOptionsFromSquareWithR(this.squaresMap, squareColumnLetter, squareRowNumber, limitation);
            const squareOptionsDiagonal = Squares.getSquaresOptionsFromSquareWithB(this.squaresMap, squareColumnLetter, squareRowNumber, limitation);
            options.push(...squareOptionsVertHorz, ...squareOptionsDiagonal);
        }
        if (letter === 'k') {
            const squareOptions = Squares.getSquaresOptionsFromSquareWithK(squareColumnLetter, squareRowNumber);
            options.push(...squareOptions);
        }
        return options;
    }


}