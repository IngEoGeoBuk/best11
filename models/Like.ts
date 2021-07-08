import mongoose, { model, Model, Schema } from "mongoose"
import { LikeDislikeType } from '../types'

const LikeSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    poId: {
        type: String,
        required: true
    }
});

export const Like: Model<LikeDislikeType> = mongoose.models.Like || model('Like', LikeSchema);
