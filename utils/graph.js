function Graph(n) {
    this.n = n;
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push([]);
    }
    this.adjListArray = arr;
}

Graph.prototype.addEdge = function (src, dest) {
    this.adjListArray[src].push(dest);
    this.adjListArray[dest].push(src);
};

Graph.prototype.dfs = function (v, visited) {
    visited[v] = true;
    for (let x = 0; x < this.adjListArray[v].length; x++) {
        if (!visited[this.adjListArray[v][x]]) {
            this.dfs(this.adjListArray[v][x], visited);
        }
    }
};

Graph.prototype.connectedComponents = function () {
    let visited = new Array(this.n);
    let count = 0;
    for (let i = 0; i < this.n; i++) {
        visited[i] = false;
    }
    for (let v = 0; v < this.n; ++v) {
        if (!visited[v]) {
            this.dfs(v, visited);
            count++;
        }
    }
    return count;
}

Graph.prototype.subgraph = function (indices) {
    let subgraph = new Graph(indices.length);
    for (let x = 0; x < indices.length; x++) {
        for (let y = x + 1; y < indices.length; y++) {
            if (this.adjListArray[indices[x]].includes(indices[y])) {
                subgraph.addEdge(x, y);
            }
        }
    }
    return subgraph;
}

const toGraph = (data, nx, ny) => {
    const block = require('./block');
    const d = data.replace(/[\r\n\t\s]/g, '');
    const pti = block.positionToIndex(data, nx, ny);
    const g = new Graph(block.numPoints(data));
    for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
            let curr = j * nx + i;
            if (d[curr] !== '1') { continue; }
            if (i !== nx - 1) {
                let right = curr + 1;
                if (d[right] === '1') {
                    g.addEdge(pti[curr], pti[right]);
                }
            }
            if (j !== ny - 1) {
                let bottom = curr + nx;
                if (d[bottom] === '1') {
                    g.addEdge(pti[curr], pti[bottom]);
                }
            }
        }
    }
    return g;
}


module.exports = { Graph, toGraph };