import { VercelRequest, VercelResponse } from '@vercel/node';
import request from 'unirest';

export default function (req: VercelRequest, res: VercelResponse): Promise<void> | object {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({
      error: true,
      message: 'Invallid Room ID'
    });
  }

  return request.get(`https://www.showroom-live.com/api/live/streaming_url?room_id=${roomId}&abr_available=1`)
    .then((result: any) => result.body)
    .then((result: any) => res.status(200).json(result))
    .catch((err: any) => res.status(500).json(err));
}
