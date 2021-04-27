import {MongoClient} from "https://deno.land/x/mongo@v0.21.0/mod.ts";

const client = new MongoClient();
await client.connect("mongodb://localhost:27017");

export const db = client.database("deno_auth");
