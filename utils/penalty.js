const areLeftRightNeighbors = (data, nx, ny) => {
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

const multiplier = (data, nx, ny) => {
    const lr = areLeftRightNeighbors(data, nx, ny);
    const tb = areTopBottomNeighbors(data, nx, ny);
    const nSquared = lr.length;
    const result = [];
    for (let i = 0; i < nSquared; i++) {
        result[i] = lr[i] || tb[i] ? 1 : 1000;
    }
    return result;
}


module.exports = { areLeftRightNeighbors, areTopBottomNeighbors, multiplier };