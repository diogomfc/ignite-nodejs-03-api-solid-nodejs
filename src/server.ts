import { app } from './app';
import {env } from './env';

app.get('/', async () => {
    return { hello: 'world' };
});

app.listen({
    port: env.PORT,
    host: '0.0.0.0'
}).then(() => {
    console.log('🚀 HTTP Server Running!');
});

