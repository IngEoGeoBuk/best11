import type { NextApiRequest, NextApiResponse } from 'next'
import { EmailType } from '../../../types'

interface DataType {
    email?: EmailType
    message: string,
}

export default (req: NextApiRequest, res: NextApiResponse<DataType>) => {
    if(req.method === "POST") {
        const email = req.body.email;
        res.setHeader("Set-Cookie", `email=${email};Max-Age=36000;Secure`);
        res.statusCode = 200;
        res.json({ message: 'ok' });
    }
}