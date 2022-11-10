const colors = ['red', 'green', 'blue', 'magenta', 'cyan'];

const generate = (pts, salesmenCapacities, order, showString = false) => {
    let result = '';
    const height = 400;
    const width = 400;
    result += `<svg height="${height}" width="${width}">`;
    result += '<rect width="100%" height="100%" fill="white" />';
    salesmenCapacities.forEach((capacity, i) => {
        const rangeStart = salesmenCapacities.slice(0, i).reduce((a, b) => a + b, 0);
        const rangeEnd = salesmenCapacities.slice(0, i + 1).reduce((a, b) => a + b, 0);
        const filteredPoints = [];
        for (let j = rangeStart; j < rangeEnd; j++) {
            filteredPoints.push(pts[order[j]]);
        }
        const color = colors[i % colors.length];
        filteredPoints.forEach((p) => {
            result += `<circle cx="${(p.x + 1) * width / 2}" cy="${(-p.y + 1) * height / 2}" r="5" stroke="black" stroke-width="1" fill="${color}" />`;
        });
        if (showString) {
            let polygonPoints = '<polygon points="';
            filteredPoints.forEach((p) => {
                polygonPoints += `${(p.x + 1) * width / 2},${(-p.y + 1) * height / 2} `;
            });
            polygonPoints += `" fill="none" stroke="${color}" stroke-width="2"/>`;
            result += polygonPoints;
        }
    })
    result += '</svg>';
    return result;
};

module.exports = { generate };