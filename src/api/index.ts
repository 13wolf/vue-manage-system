import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

export const fetchTask = () => {
    return request({
        url: './task.json',
        method: 'get'
    });
};

export const fetchUsers = () => {
    return request({
        url: './user.json',
        method: 'get'
    });
};

export const fetchMenus = () => {
    return request({
        url: './menu.json',
        method: 'get'
    });
};