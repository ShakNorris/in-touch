import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
})

const Users = models.user || model('user', userSchema) // use already created model or create a new one

export default Users;