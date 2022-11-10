/* eslint-disable no-mixed-operators */
const fs = require('fs');
const salesman = require('../anneal/path');

const randomFloat = (min, max) => (Math.random() * (max - min) + min);

const points = [];
for (let i = 0; i < 20; i++) {
    points.push(new salesman.Point(randomFloat(-1, 1), randomFloat(-1, 1)));
}

const distances = undefined;
const isLoop = true;
const solution = salesman.solve(points, distances, isLoop);
const orderedPoints = solution.map((i) => points[i]);

const toSvg = (pts) => {
    let result = '';
    const height = 400;
    const width = 400;
    result += `<svg height="${height}" width="${width}">`;
    result += '<rect width="100%" height="100%" fill="white" />';
    pts.forEach((p) => {
        result += `<circle cx="${(p.x + 1) * width / 2}" cy="${(-p.y + 1) * height / 2}" r="3" stroke="black" stroke-width="1" fill="black" />`;
    });
    let polygonPoints = '<polygon points="';
    pts.forEach((p) => {
        polygonPoints += `${(p.x + 1) * width / 2},${(-p.y + 1) * height / 2} `;
    });
    polygonPoints += '" fill="none" stroke="black" stroke-width="2"/>';
    result += polygonPoints;
    result += '</svg>';
    return result;
};

const filename = 'images/one.svg';
fs.writeFile(filename, toSvg(orderedPoints), (err) => {
    if (err) { return console.err(err); }
    return console.log(`image saved in ${filename}`);
});