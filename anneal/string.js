const clus = require('./cluster');
const path = require('./path');

const permuteSlice = (mainOrder, subsliceIndices, sliceOrder) => {
    let result = [...mainOrder];
    for (let i = 0; i < sliceOrder.length; i++) {
        result[subsliceIndices[i]] = mainOrder[subsliceIndices[sliceOrder[i]]];
    }
    return result;
}

const makeDistanceVec = (points, distanceFn) => {
    const l = points.length;
    const distances = [];
    for (let i = 0; i < l; i++) {
        for (let j = 0; j < l; j++) {
            distances[i * l + j] = distanceFn([points[i].x, points[i].y], [points[j].x, points[j].y]);
        }
    }
    return distances;
}

const solve = (points, salesmenCapacities, distanceFn, isLoop) => {
    let clusteredOrder = clus.solve(points, salesmenCapacities);
    for (let i = 0; i < salesmenCapacities.length; i++) {
        const rangeStart = salesmenCapacities.slice(0, i).reduce((a, b) => a + b, 0);
        const rangeEnd = salesmenCapacities.slice(0, i + 1).reduce((a, b) => a + b, 0);
        let range = [];
        for (let j = rangeStart; j < rangeEnd; j++) {
            range.push(j);
        }
        const filteredPoints = [];
        for (let j = rangeStart; j < rangeEnd; j++) {
            filteredPoints.push(points[clusteredOrder[j]]);
        }
        const distances = makeDistanceVec(filteredPoints, distanceFn);
        const sliceOrder = path.solve(filteredPoints, distances, isLoop);
        clusteredOrder = permuteSlice(clusteredOrder, range, sliceOrder);
    }
    return clusteredOrder;
}

module.exports = { solve };