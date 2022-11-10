/* eslint-disable no-mixed-operators */
const fs = require('fs');
const clus = require('../anneal/cluster');
const rand = require('../utils/rand');
const svg = require('../utils/svg');


const points = [];
const nPoints = 20;
const salesmenCapacities = [10, 5, 5];
for (let i = 0; i < nPoints; i++) {
    points.push(new clus.Point(rand.randomFloat(-1, 1), rand.randomFloat(-1, 1)));
}

const order = clus.solve(points, salesmenCapacities);
console.log(order);

const filename = 'images/cluster.svg';
const showString = false;
fs.writeFile(filename, svg.generate(points, salesmenCapacities, order, showString), (err) => {
    if (err) { return console.err(err); }
    return console.log(`image saved in ${filename}`);
});
