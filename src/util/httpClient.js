import axiosClient from '../config/axiosConfig';
import { getReasonPhrase } from 'http-status-codes';

const HttpClient = {
    'get': async (url, config) => {
        try {
            return await axiosClient.get(url, config);
        } catch(error) {
            console.log(error);
            throw new Error(getReasonPhrase(error.status));
        }
    },
    'post': async (url, param, config) => {
        try {
            return await axiosClient.post(url, param, config);
        } catch(error) {
            throw new Error(getReasonPhrase(error.status));
        }
    },
    'put': async (url, param, config) => {
        try {
            return await axiosClient.put(url, param, config);
        } catch(error) {
            throw new Error(getReasonPhrase(error.status));
        }
    },
    'delete': async (url, config) => {
        try {
            return await axiosClient.delete(url, config);
        } catch(error) {
            throw new Error(getReasonPhrase(error.status));
        }
    }
};

Object.freeze(HttpClient);

module.exports = HttpClient;
