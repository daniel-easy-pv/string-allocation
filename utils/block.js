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

const jumps = (data) => {
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
                        result[currInd * n + diagInd] = hasXGap || hasYGap || result[currInd * n + diagInd];
                        result[diagInd * n + currInd] = hasXGap || hasYGap || result[diagInd * n + currInd];
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
                        result[currInd * n + diagInd] = hasXGap || hasYGap || result[currInd * n + diagInd];
                        result[diagInd * n + currInd] = hasXGap || hasYGap || result[diagInd * n + currInd];
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
                        result[currInd * n + diagInd] = hasXGap || hasYGap || result[currInd * n + diagInd];
                        result[diagInd * n + currInd] = hasXGap || hasYGap || result[diagInd * n + currInd];
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
                        result[currInd * n + diagInd] = hasXGap || hasYGap || result[currInd * n + diagInd];
                        result[diagInd * n + currInd] = hasXGap || hasYGap || result[diagInd * n + currInd];
                    }
                }
            }
        }
    }
    return result;
};

// .d8888b.                           888      
// d88P  Y88b                          888      
// 888    888                          888      
// 888        888d888 8888b.  88888b.  88888b.  
// 888  88888 888P"      "88b 888 "88b 888 "88b 
// 888    888 888    .d888888 888  888 888  888 
// Y88b  d88P 888    888  888 888 d88P 888  888 
//  "Y8888P88 888    "Y888888 88888P"  888  888 
//                            888               
//                            888               
//                            888               
const graph = require('./graph');
const toGraph = (data, nx, ny) => {
    const d = data.replace(/[\r\n\t\s]/g, '');
    const pti = positionToIndex(data, nx, ny);
    const g = new graph.Graph(numPoints(data));
    for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
            let curr = j * nx + i;
            if (d[curr] !== '1') { continue; }
            if (i !== nx - 1) {
                let right = curr + 1;
                if (d[right] === '1') {
                    g.addEdge(pti[curr], pti[right]);
                }
            }
            if (j !== ny - 1) {
                let bottom = curr + nx;
                if (d[bottom] === '1') {
                    g.addEdge(pti[curr], pti[bottom]);
                }
            }
        }
    }
    return g;
}

const getConnectedComponentsFn = (data, nx, ny) => {
    const g = toGraph(data, nx, ny);
    return (indices) => g.subgraph(indices).connectedComponents();
}

module.exports = {
    getNx,
    getNy, generate,
    numPoints,
    positionToIndex, indexToPosition,
    toGraph, getConnectedComponentsFn,
    areLeftRightNeighbors, areTopBottomNeighbors,
    jumps
};