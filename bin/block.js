const svg = require('../utils/svg');
const fs = require('fs');
const str = require('../anneal/string');
const distance = require('../utils/distance');

// Block settings.
let data = `
1011111111111
0011111111000
1111111111111
1111100001111
1111101111111
1111101111111
1111101111111
1111101111111
1111101111111
`;
let dataWithoutNewline = data.replace(/[\r\n]/gm, '');
let dx = 0.1;
let dy = 0.15;
let nx = 13;
let ny = 9;
let posTopLeft = [-0.9, 0.9];

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

// String settings.
const salesmenCapacities = [15, 15, 15, 15, 15, 15, 12];
const distanceFn = distance.euclideanSquared;
const showString = true;
const isLoop = false;

// Error checks.
const salesmenCapacitiesSumToNumPoints = (points, salesmenCapacities) => {
    let salesmenCapacitiesSum = salesmenCapacities.reduce((a, b) => a + b, 0);
    let isEqual = salesmenCapacitiesSum === points.length;
    if (!isEqual) {
        console.error(`Number of points (${points.length}) does not match total salesmen capacity (sum(${salesmenCapacities}) = ${salesmenCapacitiesSum})`);
    }
    return isEqual;
};

if (salesmenCapacitiesSumToNumPoints(points, salesmenCapacities)) {
    const order = str.solve(points, salesmenCapacities, distanceFn, isLoop);

    // Save to file.
    const filename = 'images/block.svg';
    fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, showString, isLoop), () => { });
}
