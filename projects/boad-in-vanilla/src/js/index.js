import Chess from './chess.js'



const chessConfig0 = {
    fen: '5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8 b - - 1 32',
    asIcon: true
}
const chess0 = new Chess(chessConfig0)
const boardContainer0 = document.getElementById("chess0");
boardContainer0.innerHTML = chess0.boardHtml


const chessConfig01 = {
    fen: 'rnbqkbnr/pp3ppp/2ppp3/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    asIcon: true
}
const chess01 = new Chess(chessConfig01)
const boardContainer01 = document.getElementById("chess01");
boardContainer01.innerHTML = chess01.boardHtml



const chessConfig02 = {
    fen: '5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8 b - - 1 32',
    asIcon: false
}
const chess02 = new Chess(chessConfig02)
const boardContainer02 = document.getElementById("chess02");
boardContainer02.innerHTML = chess02.boardHtml