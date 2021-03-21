export default class ChessControl {

    constructor(callBacks) {
        this.buffer = {
            square: null
        };
        this.callBacks = {
            onAdd: callBacks.onAdd,
        }
        this.panelControls();
    }


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

    squareControls() {
        const self = this;
        document.querySelectorAll('.chess-square').forEach(boardSquare => {
            boardSquare.addEventListener('click', function(event) {
                const targetElement = event.target || event.srcElement;
                const targetSquareName = targetElement.getAttribute('data-square');
                self.setSelectedSquare(targetSquareName);
            }, false);
        })
    }

    panelControls() {
        const self = this;
        document.querySelectorAll('.button-add-fig').forEach(button => {
            button.addEventListener('click', function(event) {
                const targetElement = event.target || event.srcElement;
                const letter = targetElement.getAttribute('data-letter');
                const color = letter === letter.toUpperCase();
                self.callBacks.onAdd(self.buffer.square, letter, color)
            }, false);
        })
    }

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
}