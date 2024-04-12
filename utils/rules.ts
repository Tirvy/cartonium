export { ruleIsNumber, ruleIsTime }

function ruleIsNumber(value: string) {
    return !isNaN(+value) || "Must be a number";
}

function ruleIsTime(value: string) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if(!timeRegex.test(value)) {
        return "Must be a valid time in HH:MM format";
    }
    return true;
}