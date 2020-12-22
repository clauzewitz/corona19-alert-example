import axios from 'axios';
import { isNil } from 'lodash';
import { StatusCodes } from 'http-status-codes';

const axiosClient = axios.create({
    baseURL: 'http://openapi.data.go.kr/openapi/service/rest/Covid19',
    timeout: 20000,
    headers: {
        'Content-Type': 'text/xml'
    },
    withCredentials: false
});

axiosClient.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const errorResponse = error.response;

    if (isNil(errorResponse)) {
        console.error(`서버와의 통신에 실패하였습니다.\n다음에 다시 시도해주십시오.`);
        return Promise.reject({
            data: undefined,
            status: StatusCodes.SERVICE_UNAVAILABLE
        });
    }

    switch (errorResponse.status) {
        case StatusCodes.UNAUTHORIZED:
        case StatusCodes.FORBIDDEN:
            console.error(`인증되지 않은 접근입니다.`);
            break;
        case StatusCodes.NOT_FOUND:
            console.error(`찾을 수 없습니다.`);
            break;
        case StatusCodes.BAD_REQUEST:
            console.error(`잘못된 요청입니다.`);
            break;
        case StatusCodes.INTERNAL_SERVER_ERROR:
        case StatusCodes.SERVICE_UNAVAILABLE:
        case StatusCodes.METHOD_NOT_ALLOWED:
        default:
            console.error(`서버와의 통신에 실패하였습니다.\n다음에 다시 시도해주십시오.`);
    }

    return Promise.reject({
        data: errorResponse.data,
        status: errorResponse.status
    });
});

module.exports = axiosClient;
