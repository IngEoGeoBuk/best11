import mongoose, { model, Model, Schema } from "mongoose"
import { ModelCommentType } from '../types'

const CommentSchema: Schema = new Schema({
    poId: {
        type: String,
        required: true
    },
    coId: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    time: {
        type: Date, 
        required: true
    },
    updated_time: {
        type: Date, 
        required: false
    }
});

export const Comment: Model<ModelCommentType> = mongoose.models.Comment || model('Comment', CommentSchema);
