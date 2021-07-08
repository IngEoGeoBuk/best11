import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect";
import { Player } from '../../../models/Player';
import { ModelPlayerType } from '../../../types'

interface DataType {
    data?: ModelPlayerType[]
    success: boolean,
}

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    const { method } = req;

    switch(method) {
        // 전체 선수들 리스트 불러오기
        case 'GET':
            try {
                const players = await Player.find();
                res.status(200).json({ success: true, data: players })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        // 게시글에 있는 선수들 불러오기
        case 'POST':
            try {
                const list = req.body.players
                const players = await Player.find({ "_id" : {$in: list}})
                const newList = []
                for(let i = 0; i < 11; i++) {
                    for(let j = 0; j < 11; j ++) {
                        if(list[i] == players[j]._id) {
                            newList.push(players[j]);
                        }
                    }
                }
                res.status(200).json({ success: true, data: newList })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default: 
            res.status(400).json({ success: false });
            break;
    }
}