const generate = (data, nx, ny, dx, dy, posTopLeft) => {
    let dataWithoutNewline = data.replace(/[\r\n]/gm, '');
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


module.exports = { generate };