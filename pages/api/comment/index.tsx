import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect";
import { Comment } from '../../../models/Comment';
import { ModelCommentType } from '../../../types'

interface DataType {
    data?: ModelCommentType | ModelCommentType[]
    success: boolean,
}

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    const { method } = req;

    switch(method) {
        // 댓글 달기
        case 'POST':
            try {
                const comment = await Comment.create(req.body);
                res.status(201).json({ success: true, data: comment })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}