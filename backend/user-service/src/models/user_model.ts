import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    image: string,
    bio: string
    linkedin: string,
};

const schema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    linkedin: {
        type: String
    }}, {timestamps: true}
);

const User = mongoose.model<IUser>("User",schema);

export default User;