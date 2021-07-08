import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect";
import { Player } from '../../../models/Player';
import { ModelPlayerType } from '../../../types'

interface DataType {
    success: boolean,
    data?: string[]
}

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    const { method } = req;

    switch(method) {
        // 전체 클럽 리스트 불러오기
        case 'GET':
            try {
                const clubs = await Player.distinct( "club" )
                res.status(200).json({ success: true, data: clubs })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}