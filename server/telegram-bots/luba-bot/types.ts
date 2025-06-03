export type Question = {
    theme: string,
    text: string,
    variants: string[],
    trueAnswer: number
}

export type Answer = {
    chatId: number,
    theme: string,
    questionText: string,
    chosenAnswer: string,
    date: number,
}

export type StoredState = {
    testProgress: {
        [chatId: number]: {
            theme: string,
            step: number,
        } | undefined,
    }
}

export type QuestionsHashed = { [theme: string]: Question[] }