const getIthSalesmanRange = (salesmenCapacities, i) => {
    const rangeStart = salesmenCapacities.slice(0, i).reduce((a, b) => a + b, 0);
    const rangeEnd = salesmenCapacities.slice(0, i + 1).reduce((a, b) => a + b, 0);
    let range = [];
    for (let j = rangeStart; j < rangeEnd; j++) {
        range.push(j);
    }
    return range;
};

module.exports = { getIthSalesmanRange };