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

module.exports = { Graph };