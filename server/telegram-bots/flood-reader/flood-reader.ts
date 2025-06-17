import botFloodReader from './bot-object';
export default botFloodReader;
import credentials from '@/creds.json';

import textToSpeech from '@google-cloud/text-to-speech';
const client = new textToSpeech.TextToSpeechClient({
    credentials,
});

async function quickStart() {

    botFloodReader.startPolling();
    // botFloodReader.on('message', async (message) => {
    //     console.log(JSON.stringify(message));

    //     botFloodReader.sendMessage({
    //         chat_id: message.chat.id,
    //         text: response.audioContent as string,
    //     })

    //     botFloodReader.sendVoice({
    //         chat_id: message.chat.id,
    //         voice: response.audioContent as string,
    //     })
    // })


    // The text to synthesize
    // const text = 'hello, world!';

    // // Construct the request
    // const request = {
    //     input: { text: text },
    //     // Select the language and SSML voice gender (optional)
    //     voice: { languageCode: 'en-US', ssmlGender: 3 },
    //     // select the type of audio encoding
    //     audioConfig: { audioEncoding: 3 },
    // };

    // // Performs the text-to-speech request
    // const [response] = await client.synthesizeSpeech(request);
    // console.log('Audio content written to file: output.mp3');
}

if (botFloodReader) {
    quickStart();
}