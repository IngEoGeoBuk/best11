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
        // 게시글 별 댓글들 다 불러오기(Details)
        case 'GET':
            try {
                const comments = await Comment.find({ "poId" : {$in: [ (`${id}`)]} , "coId": null})!;
                if (!comments) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: comments })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        // 댓글 수정
        case 'PUT':
            try {
                const updateComment = await Comment.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });
                if (!updateComment) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: updateComment })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        // 댓글 삭제
        case 'DELETE':
            try {
                const deleteComment = await Comment.deleteOne({ _id: id })
                if (!deleteComment) {
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