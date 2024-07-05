import React from "react";
import APIs, { endpoints } from "./APIs";

export const login = async data => {
    const [user, setUsser] = React.useState({});
    try {
        let res = await APIs.post(endpoints['login'], {
            ...user,
            'client_id': '',
            'client_secret': '',
            'frant_type': 'password'
        })
        return res;
    } catch (error) {
        return error.response.data;
    }
};
// 5p50