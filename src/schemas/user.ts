interface UserSchema {
    _id: { $oid: string };
    name: string;
    email: string;
    password: string;
}
