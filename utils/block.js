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

module.exports = { getNx, getNy, generate, numPoints, positionToIndex, toGraph, getConnectedComponentsFn };