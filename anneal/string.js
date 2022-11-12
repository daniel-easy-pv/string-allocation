const clus = require('./cluster');
const path = require('./path');
const rnge = require('../utils/range');

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
        const range = rnge.getIthSalesmanRange(salesmenCapacities, i);
        const filteredOrder = range.map(j => clusteredOrder[j]);
        const filteredPoints = filteredOrder.map(j => points[j]);
        const filteredDistances = makeFilteredDistanceVec(distances, points.length, filteredOrder);
        const sliceOrder = path.solve(filteredPoints, filteredDistances, isLoop);
        clusteredOrder = permuteSlice(clusteredOrder, range, sliceOrder);
    }
    return clusteredOrder;
}

module.exports = { solve };