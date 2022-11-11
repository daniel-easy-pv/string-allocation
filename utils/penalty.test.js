const penalty = require('./penalty');

// test('no left right neighbors', () => {
//     const data = `
//     101
//     101
//     `;
//     const nx = 3;
//     const ny = 2;
//     const n = 4;
//     const v = penalty.areLeftRightNeighbors(data, nx, ny);
//     for (let i = 0; i < n; i++) {
//         expect(v[i]).toBe(false);
//     }
// });

// test('two left right neighbors', () => {
//     const data = `
//     111
//     101
//     `;
//     const nx = 3;
//     const ny = 2;
//     const n = 5;
//     const v = penalty.areLeftRightNeighbors(data, nx, ny);
//     expect(v.length).toBe(n * n);
//     expect(v[0 * n + 1]).toBe(true);
//     expect(v[1 * n + 0]).toBe(true);
//     expect(v[1 * n + 2]).toBe(true);
//     expect(v[2 * n + 1]).toBe(true);
// });

// test('two top bottom neighbors 1', () => {
//     const data = `
//     111
//     101
//     `;
//     const nx = 3;
//     const ny = 2;
//     const n = 5;
//     const v = penalty.areTopBottomNeighbors(data, nx, ny);
//     expect(v.length).toBe(n * n);
//     expect(v[0 * n + 0]).toBe(false);
//     expect(v[0 * n + 3]).toBe(true);
//     expect(v[3 * n + 0]).toBe(true);
//     expect(v[2 * n + 4]).toBe(true);
//     expect(v[4 * n + 2]).toBe(true);
// });

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
    const v = penalty.areTopBottomNeighbors(data, nx, ny);
    expect(v.length).toBe(n * n);
    expect(v[0 * n + 0]).toBe(false);
    expect(v[0 * n + 2]).toBe(true);
    expect(v[3 * n + 5]).toBe(true);
});