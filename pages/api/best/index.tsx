import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect";
import { Board } from '../../../models/Board';
import { Like } from '../../../models/Like';
import { ModelBoardType, LikeDislikeType } from '../../../types'

interface DataType {
    data?: ModelBoardType | ModelBoardType[]
    success: boolean,
}

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    const { method } = req;

    switch(method) {
        // 전체 선수들 리스트 불러오기
        case 'GET':
            try {
                const bests = await Like.aggregate([{
                    $group: {
                        _id: { poId: "$poId" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        count: { $gt: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        poId: "$_id.poId",
                        count: 1
                    }
                }])
                const bestsId = []

                bests.forEach(element => {
                    bestsId.push(element.poId);
                });
                const boards = await Board.find({ _id: { $in: bestsId } }, { _id: 1, title: 1 }).sort({time: -1});
                res.status(200).json({ success: true, data: boards })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}