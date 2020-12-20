'use strict'
import { isArray, isEmpty, isEqual } from 'lodash';
import dayjs from 'dayjs';
import HttpClient from './util/httpClient';
import slack from './service/slack';
import ResultCodes from './type/resultCodes';

const ACCESS_KEY = process.env.OPEN_API_ACCESS_KEY;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

slack.defaults.token = process.env.SLACK_TOKEN;

const getCovid19State = async () => {
    try {
        const response = await HttpClient.get('/getCovid19InfStateJson', {
            params: {
                serviceKey: ACCESS_KEY,
                startCreateDt: dayjs().subtract(1, 'day').format('YYYYMMDD'),
                endCreateDt: dayjs().format('YYYYMMDD')
            }
        });

        const resultCode = response?.data?.response?.header?.resultCode ?? ResultCodes.UNKNOWN_ERROR;
        const itemArray = response?.data?.response?.body?.items?.item;

        if (isEqual(resultCode, ResultCodes.OK)) {

            if (isArray(itemArray) && !isEmpty(itemArray)) {
                const todayCovidState = itemArray.shift();
                const yesterDayCovidState = itemArray.pop();

                let accDefRate = (todayCovidState?.accDefRate ?? 0);

                let todayDecideCnt = (todayCovidState?.decideCnt ?? 0) - (yesterDayCovidState?.decideCnt ?? 0);
                todayDecideCnt = todayDecideCnt < 0 ? 0 : todayDecideCnt;

                let todayDeathCnt = (todayCovidState?.deathCnt ?? 0) - (yesterDayCovidState?.deathCnt ?? 0);
                todayDeathCnt = todayDeathCnt < 0 ? 0 : todayDeathCnt;

                console.log(itemArray);
                if (!isEmpty(SLACK_CHANNEL_ID)) {
                    const message = '🔔코로나19 확진자 현황';
                    const fields = [
                        {
                            'type': 'mrkdwn',
                            'text': `*날짜*\n${dayjs().format('YYYY.MM.DD')}`
                        },
                        {
                            'type': 'mrkdwn',
                            'text': `*확진자 수*\n${todayDecideCnt.toLocaleString()} 명`
                        },
                        {
                            'type': 'mrkdwn',
                            'text': `*누적 확진률*\n${accDefRate.toFixed(2)} %`
                        },
                        {
                            'type': 'mrkdwn',
                            'text': `*사망자 수*\n${todayDeathCnt.toLocaleString()} 명`
                        }
                    ];

                    console.log(fields);
                    slack.sendPostMessage(SLACK_CHANNEL_ID, slack.makeSlackParams(message, fields, undefined));
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

getCovid19State();
