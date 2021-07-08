import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect";
import { Like } from '../../../models/Like';
import { LikeDislikeType } from '../../../types'

interface DataType {
    data?: LikeDislikeType
    success: boolean,
}

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    const { method } = req;

    switch(method) {
        // 좋아요 누르기
        case 'POST':
            try {
                const like = await Like.create(req.body);
                res.status(201).json({ success: true, data: like })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}