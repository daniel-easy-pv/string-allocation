/* eslint-disable no-redeclare */
/**
 * @module
 * @author Daniel Ng
 *
 * Good heuristic for clustering using simulated annealing.
 * */


const sum = (arr) => {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result = result + arr[i];
    }
    return result;
};

const clusterMetric = (points, relevantOrder, distances) => {
    const n = points.length;
    const b = relevantOrder[0];
    let result = 0;
    for (let i = 0; i < relevantOrder.length; i++) {
        const a = relevantOrder[i];
        result += distances[a * n + b];
    }
    return result;
};

const clusterIMetricFromOrder = (points, salesmenCapacities, order, distances, i) => {
    const rangeStart = sum(salesmenCapacities.slice(0, i));
    const rangeEnd = sum(salesmenCapacities.slice(0, i + 1));
    const relevantOrder = order.slice(rangeStart, rangeEnd);
    return clusterMetric(points, relevantOrder, distances);
};

const clusterMetricFromOrder = (points, salesmenCapacities, order, distances) => {
    let result = 0;
    for (let i = 0; i < salesmenCapacities.length; i++) {
        result += clusterIMetricFromOrder(points, salesmenCapacities, order, distances, i);
    }
    return result;
};



/**
 * @private
 */
function Cluster(points, salesmenCapacities, distances) {
    this.points = points;
    this.salesmenCapacities = salesmenCapacities;
    this.order = new Array(points.length);
    for (var i = 0; i < points.length; i++) this.order[i] = i;
    this.distances = distances;
}
Cluster.prototype.change = function (temp) {
    const i = this.randomPos(); const
        j = this.randomPos();
    const delta = this.delta_distance(i, j);
    if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
        this.swap(i, j);
    }
};
Cluster.prototype.size = function () {
    let s = 0;
    for (let i = 0; i < this.points.length; i++) {
        s += this.distance(i, ((i + 1) % this.points.length));
    }
    return s;
};
Cluster.prototype.swap = function (i, j) {
    const tmp = this.order[i];
    this.order[i] = this.order[j];
    this.order[j] = tmp;
};
Cluster.prototype.delta_distance = function (i, j) {
    const originalOrder = this.order;
    const swappedOrder = [...originalOrder];
    [swappedOrder[i], swappedOrder[j]] = [swappedOrder[j], swappedOrder[i]];
    const originalDistance = clusterMetricFromOrder(this.points.map(p => [p.x, p.y]), this.salesmenCapacities, originalOrder, this.distances);
    const swappedDistance = clusterMetricFromOrder(this.points.map(p => [p.x, p.y]), this.salesmenCapacities, swappedOrder, this.distances);
    return swappedDistance - originalDistance;
};
Cluster.prototype.index = function (i) {
    return (i + this.points.length) % this.points.length;
};
Cluster.prototype.access = function (i) {
    return this.points[this.order[this.index(i)]];
};
Cluster.prototype.distance = function (i, j) {
    return this.distances[this.order[i] * this.points.length + this.order[j]];
};
// Random index between 1 and the last position in the array of points
Cluster.prototype.randomPos = function () {
    // return 1 + Math.floor(Math.random() * (this.points.length - 1));
    return Math.floor(Math.random() * (this.points.length));
};

/**
 * Solves the following problem:
 *  Given a list of points and the distances between each pair of points,
 *  what is the shortest possible route that visits each point exactly
 *  once and returns to the origin point?
 *
 * @param {Point[]} points The points that the path will have to visit.
 * @param {Number} [temp_coeff=0.999] changes the convergence speed of the algorithm: the closer to 1, the slower the algorithm and the better the solutions.
 * @param {Function} [callback=] An optional callback to be called after each iteration.
 *
 * @returns {Number[]} An array of indexes in the original array. Indicates in which order the different points are visited.
 *
 * @example
 * var points = [
 *       new salesman.Point(2,3)
 *       //other points
 *     ];
 * var solution = salesman.solve(points);
 * var ordered_points = solution.map(i => points[i]);
 * // ordered_points now contains the points, in the order they ought to be visited.
 * */
function solve(points, salesmenCapacities, distances) {
    const cluster = new Cluster(points, salesmenCapacities, distances);
    if (points.length < 2) return cluster.order; // There is nothing to optimize
    const intensity = 10;
    const temp_coeff = 1 - Math.exp(-intensity - Math.min(points.length, 1e6) / 1e5);

    for (let temperature = 100 * distance(cluster.access(0), cluster.access(1));
        temperature > 1e-6;
        temperature *= temp_coeff) {
        cluster.change(temperature);
    }
    return cluster.order;
}

function distance(p, q) {
    const dx = p.x - q.x; const
        dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
}





if (typeof module === 'object') {
    module.exports = {
        solve,
    };
}
