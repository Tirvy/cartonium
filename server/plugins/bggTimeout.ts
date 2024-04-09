type promiseResolve = (value: unknown) => void;
import { H3Event } from 'h3';

const bggResolveQueue: promiseResolve[] = [];
const bggTimeout = 500;

const apiToTimeout = ['/api/bgg/'];

function shouldStopEvent(event: H3Event) {
    return apiToTimeout.some(url => getRequestURL(event).pathname.startsWith(url));
}

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("request", async (event) => {
        if (shouldStopEvent(event)) {
            console.log(getRequestURL(event).pathname);

            if (bggResolveQueue.length > 0) {
                await new Promise(resolve => bggResolveQueue.push(resolve));
                console.log((new Date()).getTime());
            } else {
                new Promise(resolve => bggResolveQueue.push(resolve));
            }
        }
    });
    nitroApp.hooks.hook("afterResponse", async (event) => {
        if (shouldStopEvent(event)) {
            if (bggResolveQueue.length > 0) {
                setTimeout(() => {
                    bggResolveQueue.shift();
                    if (bggResolveQueue.length > 0) {
                        const resolve = bggResolveQueue[0];
                        resolve(null);
                    }
                }, bggTimeout);
            } else {
                console.log('Resolved outside of timeout');
            }
        }
    });
})

/* что за черная магия?
Мы проверяем очередь, чтобы убедиться, что нет незавершенных промисов перед ответом. Промисы тут - это способ синхронизации между хуками request и afterResponse.
Если нет - то просто пускаем дальше. 
Если есть - ждем команды (решения промиса).
Промис решается только через время после завершения первого запроса в очереди 
*/
