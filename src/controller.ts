import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {Bson} from "https://deno.land/x/mongo@v0.21.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import {create, verify} from "https://deno.land/x/djwt@v2.2/mod.ts"

import {db} from "./database/connection.ts";
import UserSchema from './schemas/user.ts';

const users = db.collection<UserSchema>("users");

export const Register = async ({request, response}: RouterContext) => {
    const {name, email, password} = await request.body().value;

    const _id = await users.insertOne({
        name,
        email,
        password: await bcrypt.hash(password)
    })

    const user = await users.findOne({_id});

    delete user.password;

    response.body = user;
}

export const Login = async ({request, response, cookies}: RouterContext) => {
    const {email, password} = await request.body().value;

    const user = await users.findOne({email});

    if (!user) {
        response.body = 404;
        response.body = {
            message: 'User not found!'
        };
        return;
    }

    if (!await bcrypt.compare(password, user.password)) {
        response.body = 401;
        response.body = {
            message: 'Incorrect password!'
        };
        return;
    }

    const jwt = await create({alg: "HS512", typ: "JWT"}, {_id: user._id}, "secret");

    cookies.set('jwt', jwt, {httpOnly: true});

    response.body = {
        message: 'success'
    };
}

export const Me = async ({response, cookies}: RouterContext) => {
    const jwt = cookies.get("jwt") || '';

    if (!jwt) {
        response.body = 401;
        response.body = {
            message: 'unauthenticated'
        };
        return;
    }

    const payload = await verify(jwt, "secret", "HS512");

    if (!payload) {
        response.body = 401;
        response.body = {
            message: 'unauthenticated'
        };
        return;
    }

    const {password, ...userData} = await users.findOne({_id: new Bson.ObjectId(payload._id)});

    response.body = userData;
}

export const Logout = async ({response, cookies}: RouterContext) => {
    cookies.delete('jwt');

    response.body = {
        message: 'success'
    }
}
