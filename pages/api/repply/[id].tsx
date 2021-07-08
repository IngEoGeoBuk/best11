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
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        // 게시글 별 답글들 다 불러오기(Details)
        case 'GET':
            try {
                const repplys = await Comment.find({ "poId" : {$in: [ (`${id}`)]} , "coId": {$exists: true} })!;
                if (!repplys) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: repplys })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}