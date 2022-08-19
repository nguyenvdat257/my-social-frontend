
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { myConfig } from '../config';
import { callGetChatrooms, chatActions } from '../store/chat-slice';
import { notificationActions } from '../store/notification-slice';

export const useUserSocket = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token?.access);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        let wsClient = null;
        if (token) {
            wsClient = new WebSocket(myConfig.socketHostName + '/ws/user/?token=' + token);
            wsClient.onopen = e => {
                // alert('Connected successfully!')
                setWs(wsClient);
            };
            wsClient.onmessage = e => {
                const data = JSON.parse(e.data)
                // alert(data.type)
                switch (data.type) {
                    case 'status_online':
                        dispatch(chatActions.updateUserStatus({ status: true, username: data.username }));
                        break;
                    case 'status_offline':
                        dispatch(chatActions.updateUserStatus({ status: false, username: data.username }));
                        break;
                    case 'noti_alarm':
                        dispatch(notificationActions.setIsSeen(false));
                        break;
                }
            };
            wsClient.onclose = e => {
                // alert('Connectionn close!')
                console.log('Connection close!');
            }
        }
    }, [token]);
    return ws;
}
