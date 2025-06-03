import botLuba from './bot-object';
export default botLuba;
import dataStorage from './storage';
import { fetchQuestionsToLocalStore, saveAnswerToGoogle } from './api-google-sheets';
import sendBotError from './error';
import type { Question, Answer, StoredState, QuestionsHashed } from './types';
import { getQuestionsHashed, saveAnswer } from './common';
import type { CallbackQuery } from 'typescript-telegram-bot-api/dist/types';

if (botLuba) {
    botLuba.startPolling();

    checkStoredState();

    botLuba.on('message', async function (message) {
        if (message.text === '/update_questions') {
            getQuestionsHashed();
            return;
        }

        if (message.text === '/get_tests_names') {
            const questions = await dataStorage.getItem<QuestionsHashed>('questions');
            if (questions === null) {
                sendBotError(JSON.stringify(questions), message.chat.id);
                return;
            }
            const testNames = Object.keys(questions);
            botLuba.sendMessage({
                chat_id: message.chat.id,
                text: testNames.join('\n'),
            })
            return;
        }

        if (message.text?.startsWith('/start_test')) {
            const questions = await getQuestionsHashed();

            const testName = message.text.slice('/start_test'.length + 1);
            if (!questions[testName]?.length) {
                botLuba.sendMessage({
                    chat_id: message.chat.id,
                    text: `Теста под названием "${testName}" не найдено`,
                })
                return;
            }
            const testContent = questions[testName];
            const firstQuestion = await generateQuestionMessage(testContent[0]);

            botLuba.sendMessage({
                chat_id: message.chat.id,
                ...firstQuestion,
            });
            setQuestionState({
                chatId: message.chat.id,
                theme: testName,
                step: 0,
            });
            return;
        }

        botLuba.forwardMessage({
            chat_id: 327078611,
            from_chat_id: message.chat.id,
            message_id: message.message_id,
        });
        return 1;
    });

    botLuba.on("callback_query", async query => {
        const chat = query.from;
        const data = query.data;
        if (!data) {
            sendBotError(`Ответ без даты(`, chat.id);
            return;
        }
        const theme = data.split('|')[0];
        const step = +data.split('|')[1];
        const variantIndex = +data.split('|')[2];

        const questions = await getQuestionsHashed();

        const foundTest = questions[theme];
        if (!foundTest) {
            sendBotError(`Тест для ответа не найден: ${theme}`, chat.id);
            return;
        }

        if (foundTest.length > step + 1) {
            const newQuestion = await generateQuestionMessage(foundTest[step + 1]);

            botLuba.sendMessage({
                chat_id: chat.id,
                ...newQuestion,
            });
        } else {
            botLuba.sendMessage({
                chat_id: chat.id,
                text: `Все ответы приняты, тест окончен`,
            });
        }

        const oldQuestion = await generateQuestionMessage(foundTest[step], variantIndex);
        let creds = getCredsFromCallbackQuery(query);
        if (!creds) return;
        botLuba.editMessageReplyMarkup({
            ...creds,
            reply_markup: {
                inline_keyboard: oldQuestion.reply_markup.inline_keyboard,
            },
        });

        botLuba.answerCallbackQuery({
            callback_query_id: query.id,
            text: 'Ответ принят'
        });

        saveAnswer({
            chatId: chat.id,
            theme: theme,
            questionText: foundTest[step].text,
            chosenAnswer: foundTest[step].variants[variantIndex],
            date: Date.now(),
        });
    });
}

async function checkStoredState() {

    const state = await dataStorage.getItem<StoredState>('currentState');
    if (!state || !state.testProgress) {
        await dataStorage.setItem<StoredState>('currentState', {
            testProgress: {}
        })
    }

}

async function getCurrentState() {
    return await dataStorage.getItem<StoredState>('currentState')
}

const questionNumbers = ['a', 'b', 'c', 'd', 'e', 'f'];
async function generateQuestionMessage(question: Question, chosenAnswer?: number) {
    const questions = await getQuestionsHashed();

    const step = questions[question.theme].findIndex(item => item.text === question.text);
    if (step === -1) {
        console.log(questions[question.theme], question);
    }

    let questionText = question.text + '\n\n';
    question.variants.forEach((answer, index) => {
        questionText += `${questionNumbers[index]}) ${answer}\n`;
    });
    return {
        text: questionText,
        reply_markup: {
            inline_keyboard: question.variants.map((text, index) => {
                let answerText = `${questionNumbers[index]}) ${text}`;
                if (chosenAnswer === index) {
                    if (question.trueAnswer === chosenAnswer) {
                        answerText = '👍 ' + answerText;
                    } else {
                        answerText = '👎 ' + answerText;
                    }
                }
                return [
                    {
                        text: answerText,
                        callback_data: `${question.theme}|${step}|${index}`
                    }
                ]
            })
        },
    }
}

async function setQuestionState(newState: {
    chatId: number,
    theme: string,
    step: number,
}) {

    const currentState = await getCurrentState();
    if (currentState !== null) {
        currentState.testProgress[newState.chatId] = {
            theme: newState.theme,
            step: newState.step,
        }

        await dataStorage.setItem<StoredState>('currentState', currentState);
    }
}



function getCredsFromCallbackQuery(query: CallbackQuery) {
    const originalMessage = query.message;
    let creds;
    if (query.inline_message_id) {
        creds = {
            inline_message_id: query.inline_message_id
        }
    } else if (originalMessage) {
        creds = {
            message_id: originalMessage.message_id,
            chat_id: originalMessage.chat.id,
        }
    } else {
        return null;
    }
    return creds;
}