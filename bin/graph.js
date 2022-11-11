const graph = require('../utils/graph');
const block = require('../utils/block');

// let g = new graph.Graph(8);
// g.addEdge(0, 1);
// g.addEdge(1, 2);
// g.addEdge(2, 3);
// g.addEdge(3, 4);
// g.addEdge(5, 6);
// console.log(g.connectedComponents());

let data = `111100001`;
console.log(block.numPoints(data));