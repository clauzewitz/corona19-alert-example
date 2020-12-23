'use strict'
import Axios from 'axios';
import { isEmpty, isEqual } from 'lodash';
import HttpStatus from 'http-status-codes';

const axios = Axios.create({
	baseURL: 'https://slack.com/api',
	timeout: 20000,
	withCredentials: true
});

const defaults = {
	token: undefined,
	channel: undefined,
	webhookURL: undefined
};

const getHeaders = () => {
	return {
		Authorization: `Bearer ${defaults.token}`
	};
}

const getChannelInfo = (channelId) => {
	return new Promise((resolve, reject) => {

		if (!channelId) {
		    reject();
		}

		let params = {
			channel: channelId
		};

		axios.get('/channels.info', {
			headers: getHeaders(),
			params: params
		}).then(response => {

			if (isEqual(response.status, HttpStatus.OK)) {

				if (response.data.ok) {
					resolve(response.data.channel);
				} else {
					reject();
				}
			} else {
				reject();
			}
		}).catch(error => {
			reject(error);
		});
	});
}

const sendWebHookMessage = (channelId, params) => {
	return new Promise((resolve, reject) => {

		if (!channelId) {
		    reject();
		}

		params.channel = channelId;

		axios.post(this.webhookURL, params, {
			headers: getHeaders()
		}).then(response => {

			if (isEqual(response.status, HttpStatus.OK)) {
				resolve();
			} else {
				reject();
			}
		}).catch(error => {
			reject(error);
		});
	});
}

const sendPostMessage = (channelId, params) => {
	return new Promise((resolve, reject) => {

		if (!channelId) {
			reject();
		}

		params.channel = channelId;

		axios.post('/chat.postMessage', params, {
			headers: getHeaders()
		}).then(response => {

			if (isEqual(response.status, HttpStatus.OK)) {
				resolve();
			} else {
				console.log(response);
				reject();
			}
		}).catch(error => {
			console.log(error);
			reject(error);
		});
	});
}

const makeSlackParams = (message, fields, actions) => {
    fields = fields || undefined;
    actions = actions || undefined;

    const DIVIDER = {
        type: 'divider',
        block_id: 'divider'
    };
    const SECTION = {
        type: 'section',
        block_id: 'content',
        text: {
            type: 'mrkdwn',
            text: message
        },
        fields: fields
    };
    const FOOTER = {
        type: 'context',
        block_id: 'footer',
        elements: [
            {
                'type': 'mrkdwn',
                'text': 'message by *coffee_bot*'
            }
        ]
    };

    if (isEmpty(fields)) {
        delete SECTION.fields;
    }

    let blocks = makeSlackParamsBlocks(undefined, DIVIDER);
    blocks = makeSlackParamsBlocks(blocks, SECTION);
    blocks = makeSlackParamsBlocks(blocks, actions);
    blocks = makeSlackParamsBlocks(blocks, FOOTER);

    return {
        text: message,
        blocks: blocks
    };
}

const makeSlackParamsBlocks = (blocks, block) => {
    blocks = blocks || [];

    if (!isEmpty(block)) {
        blocks.push(block);
    }

    return blocks;
}

module.exports = {
	defaults: defaults,
	getChannelInfo: getChannelInfo,
	sendWebHookMessage: sendWebHookMessage,
	sendPostMessage: sendPostMessage,
	makeSlackParams: makeSlackParams
};
