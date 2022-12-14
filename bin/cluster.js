/* eslint-disable no-mixed-operators */
const fs = require('fs');
const clus = require('../anneal/cluster');
const rand = require('../utils/rand');
const svg = require('../utils/svg');


const points = [];
const nPoints = 20;
const salesmenCapacities = [10, 5, 5];
for (let i = 0; i < nPoints; i++) {
    const x = rand.randomFloat(-1, 1);
    const y = rand.randomFloat(-1, 1);
    points.push({ x, y });
}

const order = clus.solve(points, salesmenCapacities);
console.log(order);

const filename = 'images/cluster.svg';
const showString = false;
fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, showString), () => { });

