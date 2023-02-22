import axios, { AxiosInstance, AxiosError, } from 'axios';

const service: AxiosInstance = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    (config) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
