export { ruleIsNumber }

function ruleIsNumber(value) {
    return !isNaN(+value) || "Must be a number";
}