const str = require('../anneal/string');
const distance = require('../utils/distance');
const rand = require('../utils/rand');
const fs = require('fs');
const svg = require('../utils/svg');


// Generate random points.
const points = [];
const nPoints = 30;
const salesmenCapacities = [10, 10, 10];
for (let i = 0; i < nPoints; i++) {
    const x = rand.randomFloat(-1, 1);
    const y = rand.randomFloat(-1, 1);
    points.push({ x, y });
}

// Solve.
const distanceFn = distance.euclidean;
const isLoop = false;
const order = str.solve(points, salesmenCapacities, isLoop, distanceFn);


// Save to file.
const filename = 'images/string.svg';
const showString = true;
fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, showString, isLoop), () => { });
