const svg = require('../utils/svg');
const fs = require('fs');
const str = require('../anneal/string');
const distance = require('../utils/distance');
const block = require('../utils/block');
const error = require('../utils/error');

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
let dx = 0.1;
let dy = 0.15;
let posTopLeft = [-0.9, 0.9];
const salesmenCapacities = [15, 15, 15, 15, 15, 14, 13];
const points = block.generate(data, dx, dy, posTopLeft);
const distances = distance.makeDistanceVec(points, distance.euclidean);
const jumps = block.jumps(data);
for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
        const index = j * points.length + i;
        if (jumps[index]) {
            distances[index] *= 10;
        }
    }
}
const showString = true;
const isLoop = false;

// let data = `
// 1111111111
// 1111111111
// 1111111111
// 1111111111
// `;

if (error.salesmenCapacitiesSumToNumPoints(points, salesmenCapacities)) {
    const order = str.solve(points, salesmenCapacities, isLoop, distances);

    // Save to file.
    const filename = 'images/block.svg';
    fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, showString, isLoop), () => { });
}
