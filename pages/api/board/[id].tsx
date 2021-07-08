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
    const {
        query: { id },
        method
    } = req;

    switch(method) {
        // 해당 게시글 불러오기
        case 'GET':
            try {
                const board = await Board.find({ "_id" : {$in: [ (`${id}`)]} })!;
                res.status(200).json({ success: true, data: board })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        // 게시글 수정
        case 'PUT':
            try {
                const updateBoard = await Board.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });
                if (!updateBoard) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: updateBoard })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;


        // 게시글 삭제
        case 'DELETE':
            try {
                const deletedBoard = await Board.deleteOne({ _id: id })
                if (!deletedBoard) {
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