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
        query: { id },
        method
    } = req;

    switch(method) {
        // 해당 게시글에 있는 총 좋아요 갯수 가져오기
        case 'GET':
            try {
                const dislikes = await Dislike.find({ "poId" : {$in: [ (`${id}`)]} })!;
                res.status(200).json({ success: true, data: dislikes })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        // 싫어요 삭제
        case 'DELETE':
            try {
                const deleteDislike = await Dislike.deleteOne({ _id: id })
                if (!deleteDislike) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}
