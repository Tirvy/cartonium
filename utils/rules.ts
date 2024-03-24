export { ruleIsNumber }

function ruleIsNumber(value: string) {
    return !isNaN(+value) || "Must be a number";
}