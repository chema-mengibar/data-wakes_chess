export default class ChessControl {

    constructor(callBacks) {
        this.buffer = {
            squareTarget: null,
        };
        this.callBacks = callBacks;
        this.panelControls();

    }

    squareControls() {
        const self = this;
        document.querySelectorAll('.square').forEach(boardSquare => {
            boardSquare.addEventListener('click', function(event) {
                const targetElement = event.target || event.srcElement;
                const targetSquareName = targetElement.getAttribute('data-square');
                console.log('[CONTROLS] square click:', targetSquareName);
                self.checkOnSelectSquare(targetSquareName);
            }, false);
        })

    }

    async checkOnSelectSquare(selectedSquare) {
        console.log('[CONTROLS] checkOnSelectSquare:', selectedSquare, this.buffer.squareTarget);
        if (this.buffer.squareTarget) {
            if (selectedSquare === this.buffer.squareTarget) {
                this.clearBufferAndSelection();
            } else {
                const moved = await this.callBacks.movePiecesFromSquares(this.buffer.squareTarget, selectedSquare);
                if (moved) {
                    this.clearBufferAndSelection();
                } else {
                    this.clearSelectedSquareFromBuffer()
                    this.setBufferSquareTarget(selectedSquare);
                }
            }
        } else {
            this.setBufferSquareTarget(selectedSquare);
        }
    }

    panelControls() {
        const self = this;
        document.querySelectorAll('.button-add-fig').forEach(button => {
            button.addEventListener('click', function(event) {
                const targetElement = event.target || event.srcElement;
                const letter = targetElement.getAttribute('data-letter');
                const color = letter === letter.toUpperCase();
                self.callBacks.onAdd(self.buffer.squareTarget, letter.toLowerCase(), color)
                self.clearSelectedSquareFromBuffer();
            }, false);
        })

        const buttonClearSquare = document.getElementById("button-clear-square");
        buttonClearSquare.addEventListener('click', function() {
            self.callBacks.onClearSquare(self.buffer.squareTarget);
            self.clearSelectedSquareFromBuffer();
        }, false);

        const buttonDomainW = document.getElementById("button-paint-domains-w");
        buttonDomainW.addEventListener('click', function() {
            self.callBacks.onDomainW();
        }, false);

        const buttonDomainB = document.getElementById("button-paint-domains-b");
        buttonDomainB.addEventListener('click', function() {
            self.callBacks.onDomainB();
        }, false);

        const buttonDomainWB = document.getElementById("button-paint-domains-wb");
        buttonDomainWB.addEventListener('click', function() {
            self.callBacks.onDomainW();
            self.callBacks.onDomainB();
        }, false);

        const buttonClear = document.getElementById("button-clear");
        buttonClear.addEventListener('click', function() {
            self.callBacks.onClear();
        }, false);

        const buttonInit = document.getElementById("button-init");
        buttonInit.addEventListener('click', function() {
            self.callBacks.onInit();
        }, false);

        const buttonHideDomains = document.getElementById("button-hide-domains-wb");
        buttonHideDomains.addEventListener('click', function() {
            self.callBacks.onDomainsHide();
        }, false);
    }

    async setBufferSquareTarget(squareName) {
        this.buffer.squareTarget = squareName;
        if (squareName) {
            const item = document.getElementById(`base-${squareName}`);

            if (item.classList.contains('with-selection')) {
                item.classList.remove('with-selection');

            } else {
                item.classList.add('with-selection')
            }
        }
    }


    clearSelectedSquareFromBuffer() {
        const squareName = this.buffer.squareTarget;
        if (squareName) {
            const item = document.getElementById(`base-${squareName}`);
            if (item.classList.contains('with-selection')) {
                item.classList.remove('with-selection');
            }
            this.buffer.squareTarget = null;
        }
    }

    clearBufferAndSelection() {
        this.buffer.squareTarget = null;

        document.querySelectorAll('.base').forEach(squareBase => {
            squareBase.classList.remove('with-selection');
        })

    }
}