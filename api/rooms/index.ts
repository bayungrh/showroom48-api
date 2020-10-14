import { NowRequest, NowResponse } from '@vercel/node';
import request from 'unirest';
import moment from 'moment';

const groupPerGroup = (list, selected = '') => {
    let groups = ['AKB48', 'HKT48', 'JKT48', 'NGT48', 'NMB48', 'SKE48', 'STU48'];
    let isValid = false;
    selected = selected.toUpperCase();
    if(selected !== '' && groups.includes(selected)) {
        groups = [selected];
        isValid = true;
    }
    const temp = {};
    for (const index in groups) {
        const group = groups[index];
        const filterGroup = list.filter((l) => l.name.search(group) > 0);
        if(filterGroup) temp[group.toUpperCase()] = filterGroup;
    }
    return isValid ? temp[selected] : temp;
}

const roomList = (query) => {
    const {
        upcomingLive,
        liveNow,
        group
    } = query;
    const upcomingFilter = (list) => list.filter(i => i.next_live_schedule !== 0);
    const liveNowFilter = (list) => list.filter(i => i.is_live === true);

    return request.get('https://campaign.showroom-live.com/akb48_sr/data/room_status_list.json').then(async res => {
        let data = res.body;

        if(upcomingLive === "true") data = upcomingFilter(data);
        if(liveNow === "true") data = liveNowFilter(data);

        data = data.sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        }).map(row => {
            row.next_live_schedule = row.next_live_schedule > 0 ? moment(row.next_live_schedule * 1000).format('YYYY-MM-DD H:mm:ss') : 0;
            row.ranking = `${process.env.BASE_URL}/api/rooms/ranking?roomId=${row.id}`;
            return row;
        })
        data = groupPerGroup(data, group);

        return data;
    })
}


export default async function(req: NowRequest, res: NowResponse) {
    try {
        const proto = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers['x-forwarded-host'];
        process.env.BASE_URL = `${proto}://${host}`;

        roomList(req.query).then(data => {
            return res.status(200).json(data);
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}