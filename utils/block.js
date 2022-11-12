const getNx = (data) => {
    return Math.max(...data.split(/\r?\n/).map((line) => line.replace(/[^01]/g, '').length));
}
const getNy = (data) => {
    return data.replace(/[^01\n]/g, '').replace(/^\n|\n$/g, '').split(/\n/g).length;
}

const generate = (data, dx, dy, posTopLeft) => {
    let dataWithoutNewline = data.replace(/[\r\n]/gm, '');
    const nx = getNx(data);
    const ny = getNy(data);
    const points = [];
    for (let iy = 0; iy < ny; iy++) {
        for (let ix = 0; ix < nx; ix++) {
            const index = iy * nx + ix;
            if (dataWithoutNewline[index] === '1') {
                const x = posTopLeft[0] + ix * dx;
                const y = posTopLeft[1] - iy * dy;
                points.push({ x, y });
            }
        }
    }
    return points;
}

const numPoints = (data) => {
    return data.replace(/[^1]/gm, '').length;
}

const positionToIndex = (data, nx, ny) => {
    const d = data.replace(/[\r\n\t\s]/g, '');
    const result = [];
    let index = 0;
    for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
            let curr = j * nx + i;
            if (d[curr] === '1') {
                result[curr] = index;
                index++;
            } else {
                result[curr] = null;
            }
        }
    }
    return result;
}

const indexToPosition = (data, nx, ny) => {
    const d = data.replace(/[\r\n\t\s]/g, '');
    const result = [];
    let index = 0;
    for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
            let curr = j * nx + i;
            if (d[curr] === '1') {
                result[index] = curr;
                index++;
            }
        }
    }
    return result;
}

// 888b    888          d8b          888      888                                
// 8888b   888          Y8P          888      888                                
// 88888b  888                       888      888                                
// 888Y88b 888  .d88b.  888  .d88b.  88888b.  88888b.   .d88b.  888d888 .d8888b  
// 888 Y88b888 d8P  Y8b 888 d88P"88b 888 "88b 888 "88b d88""88b 888P"   88K      
// 888  Y88888 88888888 888 888  888 888  888 888  888 888  888 888     "Y8888b. 
// 888   Y8888 Y8b.     888 Y88b 888 888  888 888 d88P Y88..88P 888          X88 
// 888    Y888  "Y8888  888  "Y88888 888  888 88888P"   "Y88P"  888      88888P' 
//                               888                                             
//                          Y8b d88P                                             
//                           "Y88P"                                              
const areLeftRightNeighbors = (data, nx, ny) => {
    // returns an n x n array where result[i * n + j] = true whenever i and j are left-right neighbors.
    const d = data.replace(/[\r\n\t\s]/g, '');
    const n = (d.split('1').length - 1);
    const result = [];
    for (let i = 0; i < n * n; i++) {
        result[i] = false;
    }
    let index = 0;
    for (let iy = 0; iy < ny; iy++) {
        for (let ix = 0; ix < nx; ix++) {
            const curr = iy * nx + ix;
            const next = curr + 1;
            if (ix === nx - 1 && iy === ny - 1) { continue; } // skip last point.
            if (d[curr] === '1' && d[next] === '1' && ix !== nx - 1) {
                result[index * n + index + 1] = true;
                result[(index + 1) * n + index] = true;
            }
            if (d[curr] === '1') {
                index++;
            }
        }
    }
    return result;
}

const areTopBottomNeighbors = (data, nx, ny) => {
    const d = data.replace(/[\r\n\t\s]/g, '');
    const n = (d.split('1').length - 1);
    const result = [];
    for (let i = 0; i < n * n; i++) {
        result[i] = false;
    }
    let index = 0;
    for (let iy = 0; iy < ny - 1; iy++) { // skip bottom row.
        for (let ix = 0; ix < nx; ix++) {
            const curr = iy * nx + ix;
            const next = curr + nx;
            if (d[curr] === '1' && d[next] === '1') {
                let indexOfNext = index;
                let p = curr;
                while (p < next) {
                    p++;
                    if (d[p] === '1') {
                        indexOfNext++;
                    }
                }
                result[index * n + indexOfNext] = true;
                result[indexOfNext * n + index] = true;
            }
            if (d[curr] === '1') {
                index++;
            }
        }
    }
    return result;
}

const jumpVec = (data) => {
    const d = data.replace(/[\r\n\t\s]/g, '');
    const nx = getNx(data);
    const ny = getNy(data);
    const n = (d.split('1').length - 1);
    const pti = positionToIndex(data, nx, ny);
    const result = [];
    for (let i = 0; i < n * n; i++) {
        result[i] = false;
    }
    for (let iy = 0; iy < ny; iy++) {
        for (let ix = 0; ix < nx; ix++) {
            const currPos = iy * nx + ix;
            const currInd = pti[currPos];
            if (currInd === null) { continue; }
            let hasYGap = false;
            // down then left or right.
            for (let jy = iy; jy < ny; jy++) {
                const downPos = jy * nx + ix;
                if (d[downPos] === '0') {
                    hasYGap = true;
                }
                // check to the right.
                let hasXGap = false;
                for (let jx = ix; jx < nx; jx++) {
                    const diagPos = jy * nx + jx;
                    const diagInd = pti[diagPos];
                    if (d[diagPos] === '0') {
                        hasXGap = true;
                    }
                    if (diagInd !== null) {
                        result[currInd * n + diagInd] = hasXGap || hasYGap;
                        result[diagInd * n + currInd] = hasXGap || hasYGap;
                    }
                }
                // check to the left.
                hasXGap = false;
                for (let jx = ix; jx >= 0; jx--) {
                    const diagPos = jy * nx + jx;
                    const diagInd = pti[diagPos];
                    if (d[diagPos] === '0') {
                        hasXGap = true;
                    }
                    if (diagInd !== null) {
                        result[currInd * n + diagInd] = hasXGap || hasYGap;
                        result[diagInd * n + currInd] = hasXGap || hasYGap;
                    }
                }
            }
            // up then left or right.
            hasYGap = false;
            for (let jy = iy; jy >= 0; jy--) {
                const downPos = jy * nx + ix;
                if (d[downPos] === '0') {
                    hasYGap = true;
                }
                // check to the right.
                let hasXGap = false;
                for (let jx = ix; jx < nx; jx++) {
                    const diagPos = jy * nx + jx;
                    const diagInd = pti[diagPos];
                    if (d[diagPos] === '0') {
                        hasXGap = true;
                    }
                    if (diagInd !== null) {
                        result[currInd * n + diagInd] = (hasXGap || hasYGap) && result[currInd * n + diagInd];
                        result[diagInd * n + currInd] = (hasXGap || hasYGap) && result[diagInd * n + currInd];
                    }
                }
                // check to the left.
                hasXGap = false;
                for (let jx = ix; jx >= 0; jx--) {
                    const diagPos = jy * nx + jx;
                    const diagInd = pti[diagPos];
                    if (d[diagPos] === '0') {
                        hasXGap = true;
                    }
                    if (diagInd !== null) {
                        result[currInd * n + diagInd] = (hasXGap || hasYGap) && result[currInd * n + diagInd];
                        result[diagInd * n + currInd] = (hasXGap || hasYGap) && result[diagInd * n + currInd];
                    }
                }
            }
        }
    }
    return result;
};

const diagonalVec = (data, nx, ny) => {
    const d = data.replace(/[\r\n\t\s]/g, '');
    const itp = indexToPosition(data, nx, ny);
    const n = (d.split('1').length - 1);
    const result = [];
    for (let i = 0; i < n * n; i++) {
        result[i] = 1;
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const iPos = itp[i];
            const jPos = itp[j];
            const ix = iPos % nx;
            const iy = parseInt(iPos / nx);
            const jx = jPos % nx;
            const jy = parseInt(jPos / nx);
            const dx = Math.abs(ix - jx);
            const dy = Math.abs(iy - jy);
            const score = Math.min(dx, dy) === 0 ? 0 : dx + dy;
            result[i * n + j] = score;
        }
    }
    return result;
}

const scoreHelper = (vecScore, n, filteredOrder, isLoop) => {
    let score = 0;
    const l = filteredOrder.length;
    for (let i = 0; i < l - 1; i++) {
        score += vecScore[filteredOrder[i] * n + filteredOrder[i + 1]];
    }
    if (isLoop) {
        score += vecScore[filteredOrder[0] * n + filteredOrder[l - 1]];
    }
    return score;
};

const stringDiagonals = (data, filteredOrder, isLoop) => {
    const nx = getNx(data);
    const ny = getNy(data);
    const n = numPoints(data);
    const diagScore = diagonalVec(data, nx, ny);
    return scoreHelper(diagScore, n, filteredOrder, isLoop);
};

const stringJumps = (data, filteredOrder, isLoop) => {
    const nx = getNx(data);
    const ny = getNy(data);
    const n = numPoints(data);
    const diagScore = jumpVec(data, nx, ny);
    return scoreHelper(diagScore, n, filteredOrder, isLoop);
};

const totalDiagonals = (data, salesmenCapacities, order, isLoop) => {
    const rnge = require('./range');
    let result = 0;
    salesmenCapacities.forEach((capacity, i) => {
        const range = rnge.getIthSalesmanRange(salesmenCapacities, i);
        const filteredOrder = range.map(j => order[j]);
        result += stringDiagonals(data, filteredOrder, isLoop);
    });
    return result;
}

const totalJumps = (data, salesmenCapacities, order, isLoop) => {
    const rnge = require('./range');
    let result = 0;
    salesmenCapacities.forEach((capacity, i) => {
        const range = rnge.getIthSalesmanRange(salesmenCapacities, i);
        const filteredOrder = range.map(j => order[j]);
        result += stringJumps(data, filteredOrder, isLoop);
    });
    return result;
}


module.exports = {
    getNx,
    getNy, generate,
    numPoints,
    positionToIndex, indexToPosition,
    areLeftRightNeighbors, areTopBottomNeighbors,
    jumpVec, diagonalVec,
    stringJumps, stringDiagonals,
    totalJumps, totalDiagonals,
};