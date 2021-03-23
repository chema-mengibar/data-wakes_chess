import { cols, white, } from './chess-const.js'
import Utils from './chess-utils.js';

const boardSize = 100;

function addMarkerCircle(squareName, type = null) {
    let typeMarker = 'neutral'
    if (type === white) {
        typeMarker = 'white';
    } else if (type === false) {
        typeMarker = 'black';
    }
    const squareNode = document.getElementById(`markers-${squareName}`);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute('href', `#marker-circle-${typeMarker}`);
    squareNode.appendChild(use);
}

function addMarkerRect(squareName, type = true) {
    let typeMarker = type ? 'ok' : 'error';
    const squareNode = document.getElementById(`markers-${squareName}`);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute('href', `#marker-rect-${typeMarker}`);
    squareNode.appendChild(use);
}

function addMarkerMoveLast(squareName) {
    const squareNode = document.getElementById(`markers-${squareName}`);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute('href', `#marker-move-last`);
    squareNode.appendChild(use);
}

function addMarkerNotation(squareName, text) {
    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const textNode = document.createTextNode(text);
    textEl.setAttribute('x', '12%');
    textEl.setAttribute('y', '0');
    textEl.setAttribute('dy', '3');
    textEl.setAttribute('class', 'marker-square-notation');
    textEl.setAttribute('text-anchor', 'end');
    textEl.appendChild(textNode);

    const squareNode = document.getElementById(`markers-${squareName}`);
    squareNode.appendChild(textEl);
}


function createSquare(colIdx, rowIdx, asIcon = true) {
    const rowInt = 9 - (rowIdx + 1);

    const squareLetter = cols[colIdx];
    const squareName = Utils.getCellKey(squareLetter, rowInt);
    const x = (boardSize / 8) * colIdx;
    const y = (boardSize / 8) * rowIdx;

    const xT = asIcon ? 2 : 4;
    const yT = asIcon ? -1 : 8;
    const dyT = asIcon ? 10 : 0;

    const content = `
        <title>${squareName}</title>
        <rect id="base-${squareName}" class="base" width="12.5%" height="12.5%"  />
        <g id="markers-${squareName}" class="markers" width="12.5%" height="12.5%"  fill="transparent"/>
        <text id="piece-${squareName}" class="piece ${ asIcon ? 'asIcon' : ''}" 
            text-anchor="start" 
            x="${xT}" 
            y="${yT}" 
            dy="${dyT}"
         ></text>
    `;

    const squareEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
    squareEl.setAttribute('class', 'square');
    squareEl.setAttribute('id', `${squareName}`);
    squareEl.setAttribute('data-square', `${squareName}`);
    squareEl.setAttribute('data-square-col', `${squareLetter}`);
    squareEl.setAttribute('data-square-row', `${rowInt}`);
    squareEl.setAttribute('transform', `translate(${x},${y})`);

    squareEl.innerHTML = content;
    return squareEl
}

function setPieceInSquare(squareName, pieceLetter = '', color = true) {
    const squareNode = document.getElementById(`piece-${squareName}`);
    const className = color ? 'white' : 'black';
    squareNode.classList.add(className);
    squareNode.textContent = pieceLetter
}

export default {
    addMarkerCircle,
    addMarkerRect,
    addMarkerMoveLast,
    addMarkerNotation,
    createSquare,
    setPieceInSquare
}

/*
Svg.addMarkerCircle('e6', white);
Svg.addMarkerRect('a1');
Svg.addMarkerMoveLast('a2');
Svg.addMarkerRect('e6', false);
Svg.addMarkerNotation('f1', '??');
*/