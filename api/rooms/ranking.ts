import { VercelRequest, VercelResponse } from '@vercel/node';
import request from 'unirest';

type RoomId = string | string[];

const ranking = (roomId: RoomId): Promise<void> => 
  request.get(`https://www.showroom-live.com/api/live/summary_ranking?room_id=${roomId}`).then((body: any) => body.body).catch(() => {});

export default function (req: VercelRequest, res: VercelResponse): object {
  try {
    const { roomId } = req.query;
    if (!roomId) return res.status(400).json({
      error: true,
      message: "Invalid Room ID"
    });

    return ranking(roomId).then((data: any) => res.status(200).json(data));
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
}
