import { rows, cols, fenBase, flankQ, flankK, white, black, figures } from './chess/chess-const.js';
import Utils from './chess/chess-utils.js';
import Squares from './chess/chess-squares.js';
import Svg from './chess/chess-svg.js';
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
        this.render().then(() => {

            this.chessControls = new ChessControls(this.chessActions);
            this.chessControls.squareControls();
        });


    }

    get chessActions() {
        const self = this;
        return {
            movePiecesFromSquares: async(originSquare, targetSquare) => {
                const originPiece = self.squaresMap.get(originSquare);
                if (originPiece) {
                    self.setFigureInSquare(targetSquare, originPiece.letter, originPiece.color);
                    self.setFigureInSquare(originSquare, null);
                    self.drawPiecesFromMap();
                    return true;
                }
            },
            onAdd: (square, letter, color) => {
                if (!square) { return; }
                self.setFigureInSquare(square, letter, color);
                self.drawPiecesFromMap();
            },
            onClearSquare: (square) => {
                if (!square) { return; }
                self.setFigureInSquare(square, null);
                self.drawPiecesFromMap();
            },
            onClear: () => {
                self.squaresMap = Utils.createCellsMap(rows, cols);
                self.drawPiecesFromMap();
            },
            onInit: () => {
                self.fenToMap(fenBase);
                self.drawPiecesFromMap();
            },
            onDomainW: async() => {

                // White domain
                const squaresInWhiteDomain = []
                this.squaresMap.forEach((squareEntry, squareName) => {
                    if (squareEntry && squareEntry.color === white) {
                        const squaresFromFigure = this.getOptionfromCell(squareName);
                        squaresInWhiteDomain.push(...squaresFromFigure);
                    }
                })
                squaresInWhiteDomain.forEach(squareName => {
                    document.getElementById(`base-${squareName}`).classList.add('with-domain-white');
                })
            },
            onDomainB: async() => {

                // Black domain
                const squaresInBlackDomain = []
                self.squaresMap.forEach((squareEntry, squareName) => {
                    if (squareEntry && squareEntry.color === black) {
                        const squaresFromFigure = this.getOptionfromCell(squareName);
                        squaresInBlackDomain.push(...squaresFromFigure);
                    }
                })
                squaresInBlackDomain.forEach(squareName => {
                    document.getElementById(`base-${squareName}`).classList.add('with-domain-black');
                })
            },
            onDomainsHide: async() => {
                this.squaresMap.forEach((_, squareName) => {
                    const classList = document.getElementById(`base-${squareName}`).classList;
                    classList.remove('with-domain-white');
                    classList.remove('with-domain-black');
                })
            },
            onDomainsSquare: async(squareName) => {
                const squarePiece = self.squaresMap.get(squareName);
                if (squarePiece) {
                    Svg.addMarkerCircle(squareName, squarePiece.color);
                    const squaresFromFigure = this.getOptionfromCell(squareName);
                    squaresFromFigure.forEach(domainSquareName => {
                        const classNameDomain = squarePiece.color ? 'with-domain-white' : 'with-domain-black';
                        document.getElementById(`base-${domainSquareName}`).classList.add(classNameDomain);
                    })
                }
            },
            onDomainAttacksSquare: async(squareName) => {
                const squarePiece = self.squaresMap.get(squareName);
                if (squarePiece) {
                    Svg.addMarkerCircle(squareName, squarePiece.color);
                    const squaresOptionsFromFigure = this.getOptionfromCell(squareName);
                    squaresOptionsFromFigure.forEach(domainSquareName => {
                        const classNameDomain = squarePiece.color ? 'with-domain-white' : 'with-domain-black';
                        document.getElementById(`base-${domainSquareName}`).classList.add(classNameDomain);

                        self.squaresMap.forEach((squareMapValue, squareMapKey) => {
                            if (squareMapKey !== squareName && squareMapValue && squareMapValue.color !== squarePiece.color) {

                                const squareMapSquareOptions = self.getOptionfromCell(squareMapKey);
                                console.debug('[CHESS] onDomainAttacksSquare: mapOptions', squareMapSquareOptions);
                                console.debug('[CHESS] onDomainAttacksSquare: ´fgure', squaresOptionsFromFigure);

                                const uniques = squaresOptionsFromFigure.filter(value => squareMapSquareOptions.includes(value));
                                uniques.forEach((commonSquare) => {
                                    Svg.addMarkerCircle(squareMapKey, squareMapValue.color);
                                    Svg.addMarkerCircle(commonSquare, squareMapValue.color);

                                })
                            }
                        })
                    })
                }
            },
            onAttacksSquare: async(squareName) => {
                const squarePiece = self.squaresMap.get(squareName);
                if (squarePiece) {
                    Svg.addMarkerCircle(squareName, squarePiece.color);
                    self.squaresMap.forEach((squareMapValue, squareMapKey) => {
                        if (squareMapKey !== squareName && squareMapValue && squareMapValue.color !== squarePiece.color) {
                            const squareMapSquareOptions = self.getOptionfromCell(squareMapKey);
                            console.debug('[CHESS] onDomainAttacksSquare: mapOptions', squareMapSquareOptions);
                            if (squareMapSquareOptions.includes(squareName)) {
                                Svg.addMarkerCircle(squareMapKey, squareMapValue.color);
                                this.chessActions.onDomainsSquare(squareMapKey);
                            }
                        }
                    })
                }
            }
        }
    }

    async render() {
        await this.drawBoard();

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

    async drawBoard() {
        const svg = document.getElementById("svg-squares");
        const svgCoordinates = document.getElementById("svg-coordinates");
        rows.forEach((_, rowIdx) => {
            cols.forEach((_, colIdx) => {
                const squareEl = Svg.createSquare(colIdx, rowIdx, this.config.asIcon);
                svg.appendChild(squareEl);
            })
        })


        this.drawPiecesFromMap()

        const coordinatesItems = Svg.createCoordinates()
        coordinatesItems.forEach(coorItem => {
            svgCoordinates.appendChild(coorItem);
        })

        // setTimeout(() => {
        //     this.chessActions.onDomainB();
        //     this.chessActions.onDomainW();

        //     Svg.addMarkerRect('d6', true);
        //     Svg.addMarkerNotation('d6', 'x');
        //     Svg.addMarkerMoveLast('g3');
        //     Svg.addMarkerMoveLast('d6');

        //     Svg.addMarkerCircle('c7');
        //     Svg.addMarkerNotation('c7', '10');
        // }, 1000)
    }

    drawPiecesFromMap() {
        this.squaresMap.forEach((squareEntry, squareKey) => {
            if (squareEntry) {
                let figureText = '';
                const entryFigure = figures[squareEntry.letter];
                if (this.config.asIcon === true) {
                    figureText = entryFigure.asIcon(squareEntry.color);
                } else {
                    figureText = entryFigure.asLetter(squareEntry.color);
                }
                Svg.setPieceInSquare(squareKey, figureText, squareEntry.color)
            } else {
                Svg.setPieceInSquare(squareKey)
            }
        })
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