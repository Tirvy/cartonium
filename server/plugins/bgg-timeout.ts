type promiseResolve = (value: unknown) => void;
import { H3Event } from 'h3';

const bggResolveQueue: { resolve: promiseResolve, event: H3Event }[] = [];
const bggTimeout = 2500;

const apiToTimeout = ['/api/bgg/'];

function shouldHandleBggEvent(event: H3Event) {
    return apiToTimeout.some(url => getRequestURL(event).pathname.startsWith(url));
}

function flushQueue() {
    bggResolveQueue.forEach(item => {
        item.event.respondWith(new Response(null, { status: 429 }));
        item.resolve(null);
    });
    bggResolveQueue.length = 0;
}

let tooManyRequestsTimeoutTime = 300000;
let tooManyRequestsTimeout: NodeJS.Timeout | undefined = undefined;
function setBigTimeout() {
    tooManyRequestsTimeout = setTimeout(() => {
        tooManyRequestsTimeout = undefined;
    }, tooManyRequestsTimeoutTime);
}

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("request", async (event) => {
        // checking for bgg request
        if (shouldHandleBggEvent(event)) {
            const headers = getHeaders(event);
            if (headers['flush-queue']) {
                flushQueue();
            }

            // if we dont want new requests - just deny
            if (tooManyRequestsTimeout) {
                event.respondWith(new Response(null, { status: 429 }));
            }

            if (bggResolveQueue.length > 0) {
                // if there is something in queue - add to queue and await it to continue handling request
                await new Promise(resolve => bggResolveQueue.push({ resolve, event }));
            } else {
                // if queue is empty - handle it right now, but still add it to queue
                new Promise(resolve => bggResolveQueue.push({ resolve, event }));
            }
        }
    });
    nitroApp.hooks.hook("afterResponse", async (event) => {
        if (shouldHandleBggEvent(event)) {
            const status = getResponseStatus(event);
            console.log('ola my friend', bggResolveQueue.length);

            // if bgg says "too many requests" then we set some downtime for us
            if (status === 429) {
                setBigTimeout();
            }

            // 
            if (bggResolveQueue.length > 0) {
                setTimeout(() => {
                    bggResolveQueue.shift();
                    if (bggResolveQueue.length > 0) {
                        const item = bggResolveQueue[0];
                        item.resolve(null);
                    }
                }, bggTimeout);
            } else {
                // if the queue was empty - something strange happened
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
