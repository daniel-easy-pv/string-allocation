const rnge = require('./range');
const block = require('./block');

const colors = ['red', 'green', 'blue', 'orange', 'purple', 'gold', 'hotpink', 'silver'];

const generate = (points, salesmenCapacities, order, { showString = false, isLoop = true, data } = {}) => {
    let result = '';
    const height = 400;
    const width = 400;
    result += `<svg height="${height}" width="${width}">`;
    result += '<rect width="100%" height="100%" fill="white" />';
    salesmenCapacities.forEach((capacity, i) => {
        const range = rnge.getIthSalesmanRange(salesmenCapacities, i);
        const filteredOrder = range.map(j => order[j]);
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
        if (showString) { // string text
            let textX = filteredPoints[0].x;
            let textY = filteredPoints[0].y;
            let offsetY = 7;

            // let text = `n=${capacity}`;
            let text = `j=${block.stringJumps(data, filteredOrder, isLoop)}, d=${block.stringDiagonals(data, filteredOrder, isLoop)}`;

            let textString = `<text x="${(textX + 1) * width / 2}" y="${(-textY + 1) * height / 2 - offsetY}" 
            font-size="12" font-weight="700" fill="${color}" text-anchor="middle">
            ${text}
            </text>`;
            result += textString;
        }
    })
    if (showString) { // info
        let text = `j=${block.totalJumps(data, salesmenCapacities, order, isLoop)}, d=${block.totalDiagonals(data, salesmenCapacities, order, isLoop)}`;

        let textString = `<text x="50" y="350" 
        font-size="12" font-weight="700" text-anchor="middle">
        ${text}
        </text>`;
        result += textString;
    }
    result += '</svg>';
    return result;
};

module.exports = { generate };