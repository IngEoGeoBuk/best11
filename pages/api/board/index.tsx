import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect";
import { Board } from '../../../models/Board';
import { ModelBoardType } from '../../../types'

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
                const boards = await Board.find({}, { _id: 1, title: 1 }).sort({time: -1});
                res.status(200).json({ success: true, data: boards })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        // 게시글 만들기
        case 'POST':
            try {
                const board = await Board.create(req.body);
                res.status(201).json({ success: true, data: board })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}