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

module.exports = { euclidean, euclideanSquared, portraitEuclidean };
