
test('can get subgraph', () => {
    const graph = require('./graph');
    const data = `
    1111
    1001
    1111
    `;
    const nx = 4;
    const ny = 3;
    const indices = [0, 1, 3, 5];
    const g = graph.toGraph(data, nx, ny);
    expect(g.adjListArray[3]).toStrictEqual([2, 5]);
    const h = g.subgraph(indices);
    expect(h.n).toBe(4);
    expect(h.adjListArray[0]).toStrictEqual([1]);
    expect(h.adjListArray[1]).toStrictEqual([0]);
    expect(h.adjListArray[2]).toStrictEqual([3]);
    expect(h.connectedComponents()).toBe(2);

});