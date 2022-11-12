const svg = require('../utils/svg');
const fs = require('fs');
const str = require('../anneal/string');
const distance = require('../utils/distance');
const block = require('../utils/block');
const error = require('../utils/error');

// const data = `
// 1011111111111
// 0011111111000
// 1111111111111
// 1111100001111
// 1111101111111
// 1111101111111
// 1111101111111
// 1111101111111
// 1111101111111
// `;
// const salesmenCapacities = [17, 10, 10, 10, 10, 10, 9, 7, 7, 6, 6];

// const data = `
// 111111111
// 111101111
// 100001111
// 100001111
// 000001111
// 111111111
// 111111011
// 011111111
// `;
// const salesmenCapacities = [8, 8, 8, 8, 7, 6, 6, 5];
// const desiredScore = 0;

const data = `
1111001111
1111111101
1111111111
`;
const salesmenCapacities = [11, 11, 5];
const desiredScore = 0;


const dx = 0.15;
const dy = 0.15;
const posTopLeft = [-0.8, 0.8];
const points = block.generate(data, dx, dy, posTopLeft);
const distances = distance.makeDistanceVec(points, distance.euclidean);
const jumpVec = block.jumpVec(data);
const diagonalVec = block.diagonalVec(data);
for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
        const index = j * points.length + i;
        if (jumpVec[index]) {
            distances[index] *= 100;
        }
        if (diagonalVec[index]) {
            distances[index] *= 10 * diagonalVec[index];
        }
    }
}
const showString = true;
const isLoop = false;



if (error.salesmenCapacitiesSumToNumPoints(points, salesmenCapacities)) {
    const numTimes = 20;
    const orders = [];
    const scores = [];
    for (let i = 0; i < numTimes; i++) {
        console.log(`round ${i}`);
        orders[i] = str.solve(points, salesmenCapacities, isLoop, distances);
        const numJumps = block.totalJumps(data, salesmenCapacities, orders[i], isLoop);
        const numDiags = block.totalDiagonals(data, salesmenCapacities, orders[i], isLoop);
        scores[i] = numJumps * 100 + numDiags;
        if (scores[i] <= desiredScore) {
            console.log(`found solution after ${i} rounds`);
            break;
        }
    }
    const order = orders[scores.indexOf(Math.min(...scores))];

    // Save to file.
    const filename = 'images/block.svg';
    fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, { showString, isLoop, data }), () => { });
}
