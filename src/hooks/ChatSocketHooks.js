
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { myConfig } from '../config';
import { callGetChatrooms, chatActions } from '../store/chat-slice';

export const useChatSocket = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token?.access);
    const user = useSelector(state => state.auth.user);
    const userRef = useRef(null);
    const [wsChat, setWsChat] = useState(null);

    useEffect(() => {
        userRef.current = user;
    }, [user])

    useEffect(() => {
        let wsClient = null;
        if (token) {
            wsClient = new WebSocket(myConfig.socketHostName + '/ws/chat/?token=' + token);
            wsClient.onopen = e => {
                // alert('Connected chatroom successfully!')
                setWsChat(wsClient);
            };
            wsClient.onmessage = e => {
                const data = JSON.parse(e.data)
                // alert(data.type)
                switch (data.type) {
                    case 'message':
                        data.currentUsername = userRef.current.username;
                        dispatch(chatActions.updateNewChat(data));
                        break;
                    case 'reaction':
                        break;
                    case 'seen':
                        if (data.username != userRef.current.username) {
                            dispatch(chatActions.updateSeen(data));
                        }
                        break;
                    case 'typing':
                    case 'untyping':
                        data.currentUsername = userRef.current.username;
                        dispatch(chatActions.updateTyping(data));
                        break;
                    case 'chatroom_added':
                        dispatch(callGetChatrooms(data.username))
                        wsClient.send(JSON.stringify({
                            username: userRef.current.username,
                            type: 'chatroom_added',
                            chatroom_id: data.chatroom_id,
                        }))
                        break
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
    return wsChat;
}
