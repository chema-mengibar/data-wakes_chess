import Chess from './chess.js'



const chessConfig = {
    fen1: 'rnbqkbnr/pp3ppp/2ppp3/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fen: '5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8 b - - 1 32',
    asIcon: true
}

const chess = new Chess(chessConfig)

const boardContainer = document.getElementById("chess0");

boardContainer.innerHTML = chess.boardHtml