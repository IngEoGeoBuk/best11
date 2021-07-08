import mongoose, { model, Model, Schema } from "mongoose"
import { ModelBoardType } from '../types'

const BoardSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    players: {
        type: Array,
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

export const Board: Model<ModelBoardType> = mongoose.models.Board || model('Board', BoardSchema);
