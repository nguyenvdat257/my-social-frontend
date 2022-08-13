
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { myConfig } from '../config';
import { chatActions } from '../store/chat-slice';

export const useChatSocket = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token?.access);
    const user = useSelector(state => state.auth.user);
    const currentChatroomId = useSelector(state => state.chat.currentChatroomId);
    const chatroom = useSelector(state => state.chat.chatrooms.filter(chatroom => chatroom.id === state.chat.currentChatroomId)[0]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        let wsClient = null;
        if (token) {
            wsClient = new WebSocket(myConfig.socketHostName + '/ws/chat/?token=' + token);
            wsClient.onopen = e => {
                // alert('Connected chatroom successfully!')
                setWs(wsClient);
            };
            wsClient.onmessage = e => {
                const data = JSON.parse(e.data)
                // alert(data.type)
                switch (data.type) {
                    case 'message':
                        dispatch(chatActions.updateNewChat(data));
                        break;
                    case 'reaction':
                        break;
                    case 'seen':
                        if (data.username != user.username) {
                            dispatch(chatActions.updateSeen(data));
                        }
                        break;
                    case 'typing':
                    case 'untyping':
                        data.currentUsername = user.username;
                        dispatch(chatActions.updateTyping(data));
                        break;
                }
            };
            wsClient.onclose = e => {
                // alert('Connectionn close!')
                console.log('Connection close!')
            }
        }
        return () => {
            wsClient?.close();
        }
    }, [token]);
    return ws;
}
