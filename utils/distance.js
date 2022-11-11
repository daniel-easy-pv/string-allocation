const euclidean = (p, q) => {
    const dx = p[0] - q[0];
    const dy = p[1] - q[1];
    return Math.sqrt(dx * dx + dy * dy);
};

const euclideanSquared = (p, q) => {
    const dx = p[0] - q[0];
    const dy = p[1] - q[1];
    return dx * dx + dy * dy;
};

const portraitEuclidean = (p, q) => {
    const dx = p[0] - q[0];
    const dy = (p[1] - q[1]) * 5;
    return Math.sqrt(dx * dx + dy * dy);
};

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

module.exports = { euclidean, euclideanSquared, portraitEuclidean, makeDistanceVec };
