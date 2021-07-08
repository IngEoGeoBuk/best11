import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect";
import { Dislike } from '../../../../models/Dislike';
import { LikeDislikeType } from '../../../../types'

interface DataType {
    data?: LikeDislikeType | LikeDislikeType[] 
    success: boolean,
}
dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    const {
        query: { email },
        method
    } = req;

    switch (method) {
        // 로그인한 아이디로부터 별점 가져오기
        case 'POST':
            const poId = req.body.poId;
            const email = req.body.email;
            try {
                const dislike = await Dislike.find({ "poId" : poId, "email": email });
                if (!dislike) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: dislike })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}