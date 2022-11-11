const colors = ['red', 'green', 'blue', 'orange', 'purple', 'gold', 'hotpink', 'silver'];

const generate = (points, salesmenCapacities, order, showString = false, isLoop = true) => {
    let result = '';
    const height = 400;
    const width = 400;
    result += `<svg height="${height}" width="${width}">`;
    result += '<rect width="100%" height="100%" fill="white" />';
    salesmenCapacities.forEach((capacity, i) => {
        const rangeStart = salesmenCapacities.slice(0, i).reduce((a, b) => a + b, 0);
        const rangeEnd = salesmenCapacities.slice(0, i + 1).reduce((a, b) => a + b, 0);
        const filteredOrder = []
        for (let j = rangeStart; j < rangeEnd; j++) {
            filteredOrder.push(order[j]);
        }
        const filteredPoints = filteredOrder.map(o => points[o]);
        const color = colors[i % colors.length];
        filteredPoints.forEach((p) => {
            result += `<circle cx="${(p.x + 1) * width / 2}" cy="${(-p.y + 1) * height / 2}" r="5" stroke="black" stroke-width="1" fill="${color}" />`;
        });
        if (showString) {
            let polygonPoints = `<${isLoop ? 'polygon' : 'polyline'} points="`;
            filteredPoints.forEach((p) => {
                polygonPoints += `${(p.x + 1) * width / 2},${(-p.y + 1) * height / 2} `;
            });
            polygonPoints += `" fill="none" stroke="${color}" stroke-width="2"/>`;
            result += polygonPoints;
        }
        if (showString) {
            let textX = filteredPoints[0].x;
            let textY = filteredPoints[0].y;
            let offsetX = -5;
            let offsetY = 7;


            let text = `n=${capacity}`;
            let textString = `<text x="${(textX + 1) * width / 2 + offsetX}" y="${(-textY + 1) * height / 2 - offsetY}" font-size="10" font-weight="700" fill="${color}">${text}</text>`;
            result += textString;
        }
    })
    result += '</svg>';
    return result;
};

module.exports = { generate };