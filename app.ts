import {Application} from "https://deno.land/x/oak/mod.ts";
import {oakCors} from 'https://deno.land/x/cors@v1.2.1/mod.ts';

import router from "./src/routes.ts";

const app = new Application();

app.use(oakCors({
    credentials: true,
    origin: /^.+localhost:(3000|4200|8080)$/,
}))
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port: 8000});
