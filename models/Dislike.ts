import mongoose, { model, Model, Schema } from "mongoose"
import { LikeDislikeType } from '../types'

const DislikeSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    poId: {
        type: String,
        required: true
    }
});

export const Dislike: Model<LikeDislikeType> = mongoose.models.Dislike || model('Dislike', DislikeSchema);
