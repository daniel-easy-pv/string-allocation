const svg = require('../utils/svg');
const fs = require('fs');
const str = require('../anneal/string');
const distance = require('../utils/distance');
const block = require('../utils/block');
const penalty = require('../utils/penalty');
const error = require('../utils/error');

let data = `
10111111111111
00111111111000
11111111111111
11111000001111
11111001111111
11111001111111
11111001111111
11111001111111
11111001111111
`;
let nx = 14;
let ny = 9;
let dx = 0.1;
let dy = 0.15;
let posTopLeft = [-0.9, 0.9];
const salesmenCapacities = [15, 15, 15, 15, 15, 15, 15];
const distanceFn = distance.euclideanSquared;
const showString = true;
const isLoop = false;

// let data = `
// 1111111111
// 1111111111
// 1111111111
// 1111111111
// `;
// let nx = 10;
// let ny = 4;
// let dx = 0.1;
// let dy = 0.15;
// let posTopLeft = [-0.9, 0.9];
// const salesmenCapacities = [10, 10, 10, 10];
// const distanceFn = distance.euclidean;
// const showString = true;
// const isLoop = false;

const points = block.generate(data, dx, dy, posTopLeft);
const myPenalty = penalty.multiplier(data, nx, ny);


// Error checks.


if (error.salesmenCapacitiesSumToNumPoints(points, salesmenCapacities)) {
    const order = str.solve(points, salesmenCapacities, isLoop, distanceFn);

    // Save to file.
    const filename = 'images/block.svg';
    fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, showString, isLoop), () => { });
}
