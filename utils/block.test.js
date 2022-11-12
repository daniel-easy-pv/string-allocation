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

test('can compute indexToPosition', () => {
    const data = `
    010
    101
    011
    100
    `;
    const nx = 3;
    const ny = 4;
    const itp = block.indexToPosition(data, nx, ny);
    expect(itp[0]).toBe(1);
    expect(itp[1]).toBe(3);
    expect(itp[2]).toBe(5);
    expect(itp[3]).toBe(7);
    expect(itp[4]).toBe(8);
    expect(itp[5]).toBe(9);
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

test('no left right neighbors', () => {
    const data = `
    101
    101
    `;
    const nx = 3;
    const ny = 2;
    const n = 4;
    const v = block.areLeftRightNeighbors(data, nx, ny);
    for (let i = 0; i < n; i++) {
        expect(v[i]).toBe(false);
    }
});

test('two left right neighbors', () => {
    const data = `
    111
    101
    `;
    const nx = 3;
    const ny = 2;
    const n = 5;
    const v = block.areLeftRightNeighbors(data, nx, ny);
    expect(v.length).toBe(n * n);
    expect(v[0 * n + 1]).toBe(true);
    expect(v[1 * n + 0]).toBe(true);
    expect(v[1 * n + 2]).toBe(true);
    expect(v[2 * n + 1]).toBe(true);
});

test('two top bottom neighbors 1', () => {
    const data = `
    111
    101
    `;
    const nx = 3;
    const ny = 2;
    const n = 5;
    const v = block.areTopBottomNeighbors(data, nx, ny);
    expect(v.length).toBe(n * n);
    expect(v[0 * n + 0]).toBe(false);
    expect(v[0 * n + 3]).toBe(true);
    expect(v[3 * n + 0]).toBe(true);
    expect(v[2 * n + 4]).toBe(true);
    expect(v[4 * n + 2]).toBe(true);
});

test('two top bottom neighbors 2', () => {
    const data = `
    110
    101
    011
    100
    `;
    const nx = 3;
    const ny = 4;
    const n = 7;
    const v = block.areTopBottomNeighbors(data, nx, ny);
    expect(v.length).toBe(n * n);
    expect(v[0 * n + 0]).toBe(false);
    expect(v[0 * n + 2]).toBe(true);
    expect(v[3 * n + 5]).toBe(true);
});

test('test jump 1', () => {
    const data = `
    11011
    `;
    const nx = 5;
    const ny = 1;
    const n = 4;
    const v = block.jumps(data, nx, ny);
    expect(v.length).toBe(16);
    expect(v[0 * n + 0]).toBe(false);
    expect(v[0 * n + 1]).toBe(false);
    expect(v[0 * n + 2]).toBe(true);
    expect(v[0 * n + 3]).toBe(true);
    expect(v[1 * n + 2]).toBe(true);
    expect(v[1 * n + 3]).toBe(true);
});

test('test jump 2', () => {
    const data = `
    11011
    01000
    `;
    const n = block.numPoints(data);
    const v = block.jumps(data);
    expect(v[0 * n + 0]).toBe(false);
    expect(v[0 * n + 1]).toBe(false);
    expect(v[0 * n + 2]).toBe(true);
    expect(v[0 * n + 3]).toBe(true);
    expect(v[0 * n + 4]).toBe(true);
    expect(v[1 * n + 1]).toBe(false);
    expect(v[1 * n + 2]).toBe(true);
    expect(v[1 * n + 3]).toBe(true);
    expect(v[1 * n + 4]).toBe(false);
    expect(v[2 * n + 2]).toBe(false);
    expect(v[2 * n + 3]).toBe(false);
    expect(v[2 * n + 4]).toBe(true);
    expect(v[3 * n + 3]).toBe(false);
    expect(v[3 * n + 4]).toBe(true);
    expect(v[4 * n + 4]).toBe(false);

});

test('test jump 3', () => {
    const data = `
    10011
    11000
    `;
    const n = block.numPoints(data);
    const v = block.jumps(data);
    expect(v[0 * n + 0]).toBe(false);
    expect(v[0 * n + 1]).toBe(true);
    expect(v[0 * n + 2]).toBe(true);
    expect(v[0 * n + 3]).toBe(false);
    expect(v[0 * n + 4]).toBe(true);
    expect(v[1 * n + 1]).toBe(false);
    expect(v[1 * n + 2]).toBe(false);
    expect(v[1 * n + 3]).toBe(true);
    expect(v[1 * n + 4]).toBe(true);
    expect(v[2 * n + 2]).toBe(false);
    expect(v[2 * n + 3]).toBe(true);
    expect(v[2 * n + 4]).toBe(true);
    expect(v[3 * n + 3]).toBe(false);
    expect(v[3 * n + 4]).toBe(false);
    expect(v[4 * n + 4]).toBe(false);

});

test('test diagonalScore', () => {
    const data = `
    1001
    1011
    `;
    const nx = 4;
    const ny = 2;
    const v = block.diagonalScore(data, nx, ny);
    const n = block.numPoints(data);
    expect(v[0 * n + 0]).toBe(0);
    expect(v[0 * n + 1]).toBe(0);
    expect(v[0 * n + 2]).toBe(0);
    expect(v[0 * n + 3]).toBe(3);
    expect(v[0 * n + 4]).toBe(4);
});