const salesmenCapacitiesSumToNumPoints = (points, salesmenCapacities) => {
    let salesmenCapacitiesSum = salesmenCapacities.reduce((a, b) => a + b, 0);
    let isEqual = salesmenCapacitiesSum === points.length;
    if (!isEqual) {
        console.error(`Number of points (${points.length}) does not match total salesmen capacity (sum(${salesmenCapacities}) = ${salesmenCapacitiesSum})`);
    }
    return isEqual;
};

module.exports = { salesmenCapacitiesSumToNumPoints };