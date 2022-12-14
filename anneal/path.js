/**
 * @module
 * @author Ophir LOJKINE
 * salesman npm module
 *
 * Good heuristic for the traveling salesman problem using simulated annealing.
 * @see {@link https://lovasoa.github.io/salesman.js/|demo}
 * */

/**
 * @private
 */
function Path(points, distances = undefined, isLoop) {
    this.points = points;
    this.order = new Array(points.length);
    this.isLoop = isLoop;
    for (var k = 0; k < points.length; k++) this.order[k] = k;
    if (typeof distances === 'undefined') {
        this.distances = new Array(points.length * points.length);
        for (var i = 0; i < points.length; i++) { for (let j = 0; j < points.length; j++) this.distances[j + i * points.length] = distance(points[i], points[j]); }
    } else {
        this.distances = distances;
    }
}
Path.prototype.change = function (temp) {
    const i = this.randomPos();
    const j = this.randomPos();
    let delta = 0;
    if (this.isLoop) {
        delta = this.delta_distance(i, j);
    } else {
        delta = this.delta_distance_no_loop(i, j);
    }
    if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
        this.swap(i, j);
    }
};
Path.prototype.size = function () {
    let s = 0;
    for (let i = 0; i < this.points.length; i++) {
        s += this.distance(i, ((i + 1) % this.points.length));
    }
    return s;
};
Path.prototype.swap = function (i, j) {
    const tmp = this.order[i];
    this.order[i] = this.order[j];
    this.order[j] = tmp;
};
Path.prototype.delta_distance = function (i, j) {
    const jm1 = this.index(j - 1);
    const jp1 = this.index(j + 1);
    const im1 = this.index(i - 1);
    const ip1 = this.index(i + 1);
    let s = this.distance(jm1, i)
        + this.distance(i, jp1)
        + this.distance(im1, j)
        + this.distance(j, ip1)
        - this.distance(im1, i)
        - this.distance(i, ip1)
        - this.distance(jm1, j)
        - this.distance(j, jp1);
    if (jm1 === i || jp1 === i) { s += 2 * this.distance(i, j); }
    return s;
};
Path.prototype.delta_distance_no_loop = function (i, j) {
    const originalOrder = this.order;
    const swappedOrder = [...this.order];
    [swappedOrder[i], swappedOrder[j]] = [swappedOrder[j], swappedOrder[i]];
    let originalDistance = 0;
    let swappedDistance = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
        originalDistance += this.distances[originalOrder[i] * this.points.length + originalOrder[i + 1]];
        swappedDistance += this.distances[swappedOrder[i] * this.points.length + swappedOrder[i + 1]];
    }
    return swappedDistance - originalDistance;
};
Path.prototype.index = function (i) {
    return (i + this.points.length) % this.points.length;
};
Path.prototype.access = function (i) {
    return this.points[this.order[this.index(i)]];
};
Path.prototype.distance = function (i, j) {
    return this.distances[this.order[i] * this.points.length + this.order[j]];
};
// Random index between 1 and the last position in the array of points
Path.prototype.randomPos = function () {
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
function solve(points, distances = undefined, isLoop = true) {
    const path = new Path(points, distances, isLoop);
    if (points.length < 2) return path.order; // There is nothing to optimize
    const intensity = 9;
    const temp_coeff = 1 - Math.exp(-intensity - Math.min(points.length, 1e6) / 1e5);

    for (let temperature = 100 * distance(path.access(0), path.access(1));
        temperature > 1e-6;
        temperature *= temp_coeff) {
        path.change(temperature);
    }
    return path.order;
}

/**
 * Represents a point in two dimensions.
 * @class
 * @param {Number} x abscissa
 * @param {Number} y ordinate
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function distance(p, q) {
    const dx = p.x - q.x; const
        dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
}

if (typeof module === 'object') {
    module.exports = {
        solve,
        Point,
    };
}
