import Chess from './chess.js'

const fens = [
    '5k2/ppp5/4P3/3R1r1p/6P1/1K2Nr2/PP3P2/8 b - - 1 32',
    'rn2k1r1/ppp1pp1p/3p2p1/5bn1/P7/2N2B2/1PPPPP2/2BNK1RR  b - - 1 32',
    'rnbqkbnr/pp3ppp/2ppp3/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
]

const configA = {
    fen: fens[0],
    asIcon: true
}

const chess = new Chess(configA)




const buttonA = document.getElementById("act-wFlankK");
buttonA.addEventListener('click', function() {
    console.log(chess.analyzeCountFiguresInFlank(true, 'k'))
}, false);

const buttonB = document.getElementById("act-wFlankQ");
buttonB.addEventListener('click', function() {
    console.log(chess.analyzeCountFiguresInFlank(true, 'q'))
}, false);

const buttonC = document.getElementById("act-bFlankK");
buttonC.addEventListener('click', function() {
    console.log(chess.analyzeCountFiguresInFlank(false, 'k'))
}, false);

const buttonD = document.getElementById("act-bFlankQ");
buttonD.addEventListener('click', function() {
    console.log(chess.analyzeCountFiguresInFlank(false, 'q'))
}, false);