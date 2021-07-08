import type { NextApiRequest, NextApiResponse } from 'next'
import { EmailType } from '../../../types'

export default (req: NextApiRequest, res: NextApiResponse<EmailType>) => {
    res.statusCode = 200;
    res.json({ email: req.query.email });
}
