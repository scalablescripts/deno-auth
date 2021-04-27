import {Router} from "https://deno.land/x/oak/mod.ts";
import {Login, Logout, Me, Register} from "./controller.ts";

const router = new Router();

router.post('/api/register', Register)
    .post('/api/login', Login)
    .get('/api/user', Me)
    .post('/api/logout', Logout)

export default router;
