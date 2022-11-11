const block = require('./block');

test('can get width and height of block', () => {
    const data = `
    1111
    0001
    0000
    `;
    expect(block.getNx(data)).toBe(4);
    expect(block.getNy(data)).toBe(3);
})

test('can compute positionToIndex', () => {
    const data = `
    110
    101
    011
    100
    `;
    const nx = 3;
    const ny = 4;
    const pti = block.positionToIndex(data, nx, ny);
    expect(pti[0]).toBe(0);
    expect(pti[1]).toBe(1);
    expect(pti[2]).toBe(null);
    expect(pti[3]).toBe(2);
    expect(pti[4]).toBe(null);
    expect(pti[5]).toBe(3);
});

test('can compute positionToIndex', () => {
    const data = `
    110
    101
    011
    100
    `;
    const nx = 3;
    const ny = 4;
    const g = block.toGraph(data, nx, ny);
    expect(g.connectedComponents()).toBe(3);
});

test('can get connected components function', () => {
    const data = `
    110
    101
    011
    100
    `;
    const nx = 3;
    const ny = 4;
    const connectedComponentsFn = block.getConnectedComponentsFn(data, nx, ny);
    expect(connectedComponentsFn([0, 1, 2])).toBe(1);
    expect(connectedComponentsFn([0, 1, 3])).toBe(2);
    expect(connectedComponentsFn([3, 1, 0])).toBe(2);
    expect(connectedComponentsFn([0, 1, 2, 3, 4, 5])).toBe(2);
    expect(connectedComponentsFn([0, 1, 2, 3, 4, 5, 6])).toBe(3);
    expect(connectedComponentsFn([6, 4, 5, 2, 1, 3, 0])).toBe(3);
})