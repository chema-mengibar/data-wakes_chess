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
        ...this.getOptionfromCell('e4'),

    ];

    cellsW.forEach(cellKey => {
        document.getElementById(cellKey).classList.add('with-domain-white');
    })


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





// const buttonA = document.getElementById("act-wFlankK");
// buttonA.addEventListener('click', function() {
//     console.log(chess.analyzeCountFiguresInFlank(true, 'k'))
// }, false);

// const buttonB = document.getElementById("act-wFlankQ");
// buttonB.addEventListener('click', function() {
//     console.log(chess.analyzeCountFiguresInFlank(true, 'q'))
// }, false);

// const buttonC = document.getElementById("act-bFlankK");
// buttonC.addEventListener('click', function() {
//     console.log(chess.analyzeCountFiguresInFlank(false, 'k'))
// }, false);

// const buttonD = document.getElementById("act-bFlankQ");
// buttonD.addEventListener('click', function() {
//     console.log(chess.analyzeCountFiguresInFlank(false, 'q'))
// }, false);

buttons = `
<button id="act-wFlankQ" type="button">
white flank-q
</button>
<button id="act-wFlankK" type="button">
white flank-k
</button>
<button id="act-bFlankQ" type="button">
black flank-q
</button>
<button id="act-bFlankK" type="button">
black flank-k
</button>

`



onRemove: () => {
        callBacks.onRemove();
        // self.setFigureInSquare(self.buffer.square, null);
        // self.render();
    },
    onClear: () => {
        callBacks.onClear();
        // this.squaresMap = Utils.createCellsMap(rows, cols);
        // self.render();
    },





    // controlKeys() {
    //     const self = this;
    //     document.addEventListener('keydown', (event) => {
    //         // console.log(event.key)
    //         // console.log(event.code)
    //         // console.log(event.charCode)
    //         // console.log(event.keyCode)
    //         // console.log(event.which)
    //         // console.log(event.ctrlKey)
    //         console.log(event.shiftKey, event.key);

    //         if (['r', 'n', 'b', 'k', 'q', 'p', 'R', 'N', 'B', 'K', 'Q', 'P', ].includes(event.key)) {
    //             self.buffer.letter = event.key
    //         } else if (event.key === '+') {
    //             if (self.buffer.square) {
    //                 this.callBacks.onAdd();
    //             }
    //         } else if (event.key === '-') {
    //             if (self.buffer.square) {
    //                 this.callBacks.onRemove();
    //             }

    //         } else if (event.key === '=' && event.shiftKey) {
    //             this.callBacks.onClear();
    //         }
    //     });

    // }



    setSelectedSquare(squareName) {
        this.buffer.square = squareName;
        const item = document.getElementById(squareName);
        item.classList.add('with-selection');
        // if (squareName) {
        //     const item = document.getElementById(squareName);
        //     if (item.classList.contains('with-selection')) {
        //         item.classList.remove('with-selection');

        //     } else {
        //         item.classList.add('with-selection')
        //     }

        // } else {
        //     this.buffer.square = null;
        // }

    }