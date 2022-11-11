const clus = require('./cluster');
const path = require('./path');

const permuteSlice = (mainOrder, subsliceIndices, sliceOrder) => {
    let result = [...mainOrder];
    for (let i = 0; i < sliceOrder.length; i++) {
        result[subsliceIndices[i]] = mainOrder[subsliceIndices[sliceOrder[i]]];
    }
    return result;
}

const makeFilteredDistanceVec = (distances, n, relevantOrder) => {
    const rl = relevantOrder.length;
    const result = new Array(rl * rl);
    for (let i = 0; i < rl; i++) {
        for (let j = 0; j < rl; j++) {
            const d = distances[relevantOrder[j] * n + relevantOrder[i]];
            result[j * rl + i] = d;
            result[i * rl + j] = d;
        }
    }
}

const solve = (points, salesmenCapacities, isLoop, distances) => {
    let clusteredOrder = clus.solve(points, salesmenCapacities, distances);
    for (let i = 0; i < salesmenCapacities.length; i++) {
        const rangeStart = salesmenCapacities.slice(0, i).reduce((a, b) => a + b, 0);
        const rangeEnd = salesmenCapacities.slice(0, i + 1).reduce((a, b) => a + b, 0);
        let range = [];
        for (let j = rangeStart; j < rangeEnd; j++) {
            range.push(j);
        }
        const filteredOrder = [];
        const filteredPoints = [];
        for (let j = rangeStart; j < rangeEnd; j++) {
            filteredOrder.push(clusteredOrder[j]);
            filteredPoints.push(points[clusteredOrder[j]]);
        }
        const filteredDistances = makeFilteredDistanceVec(distances, points.length, filteredOrder);
        const sliceOrder = path.solve(filteredPoints, filteredDistances, isLoop);
        clusteredOrder = permuteSlice(clusteredOrder, range, sliceOrder);
    }
    return clusteredOrder;
}

module.exports = { solve };