import { NowRequest, NowResponse } from '@vercel/node';
import request from 'unirest';

const ranking = (roomId) => {
    return request.get(`https://www.showroom-live.com/api/live/summary_ranking?room_id=${roomId}`).then(body => body.body).catch(() => {});
}

export default async function(req: NowRequest, res: NowResponse) {
    try {
        const {roomId} = req.query;
        if(!roomId) return res.status(400).json({
            error: true,
            message: "Invalid Room ID"
        });

        ranking(roomId).then(data => res.status(200).json(data));
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}