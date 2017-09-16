import { Schema, model, Document } from 'mongoose';
import { BaseTime, preSaveAddBaseTime } from './base';
import * as bcrypt from 'bcrypt';

const BCRYPT_SALT_WORK_FACTOR = 10;

export interface User {
    username: string;
    password: string;
}

export interface UserModel extends User, BaseTime, Document {
    comparePassword(password: string): boolean;
}

const modelSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
});

modelSchema.pre('save', preSaveAddBaseTime);

// Use bcrypt to has the user password in the DB
modelSchema.pre('save', function preSaveAddPasswordHash(next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(BCRYPT_SALT_WORK_FACTOR, function (errorSalt, salt) {
        if (errorSalt) {
            return next(errorSalt);
        }

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (errorHash, hash) {
            if (errorHash) {
                return next(errorHash);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

modelSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

////// Create Model /////

export const UserModel = model<UserModel>('User', modelSchema);

////// Functions ////////

export function getUsers(limit = 100) {
    return UserModel.find().limit(limit);
}

export function getUserById(id: string) {
    return UserModel.findOne({ _id: id });
}

export function getUserByUsername(username) {
    return UserModel.findOne({ username });
}

export function addUser(input: User) {
    const rec = UserModel.create(input);

    return rec;
}

export function removeUser(id) {
    return UserModel.findByIdAndRemove(id);
}
