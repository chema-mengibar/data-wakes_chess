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



// return this.printBoardHtml().then(
//     response => {
//         if (this.config.asLines) {
//             document.getElementById("chess").classList.add('asLines');
//         }
//         document.getElementById("chess").innerHTML = response;
//         this.chessControls.squareControls();
//     }
// )


//Markers

const children = document.querySelectorAll(`#markers-${squareTarget} > use`);
children.forEach(child => {
    const href = child.getAttribute('href');
    if (href === `#${markerId}`) {
        console.log('contains marker');
    }
})