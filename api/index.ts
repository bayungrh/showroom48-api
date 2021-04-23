import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function(req: VercelRequest, res: VercelResponse) {
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'];
  const BASE_URL = `${proto}://${host}`;

  res.json({
    rooms: `${BASE_URL}/api/rooms`,
    roomQuery: {
      perGroup: `${BASE_URL}/api/rooms?group=AKB48`,
      liveNow: `${BASE_URL}/api/rooms?liveNow=true`,
      upcomingLive: `${BASE_URL}/api/rooms?upcomingLive=true`,
      selectRoom: `${BASE_URL}/api/rooms?roomId=[roomId]`
    },
    roomRanking: `${BASE_URL}/api/rooms/ranking?roomId=[roomId]`
  });
}