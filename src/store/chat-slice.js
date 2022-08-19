import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { toastActions } from './toast-slice';
import { callApi } from './actions';
import moment from 'moment'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatrooms: [],
        chatroomProps: {},
        isSeen: true,
        currentChatroomId: null,
        gettingChatrooms: false,
        gettingChat: false,
        creatingChatroom: false,
        showCreateChat: false,
        createUsernames: [],
        suggestProfiles: [],
        searchProfiles: [],
        searchingProfile: false,
        searchType: 'default',
    },
    reducers: {
        setChatrooms(state, action) {
            // state.chatrooms = action.payload.data;
            const newChatrooms = action.payload.data.filter(dataChatroom => state.chatrooms.filter(chatroom => chatroom.id === dataChatroom.id).length === 0);

            for (let chatroom of newChatrooms) {
                chatroom.otherProfiles = chatroom.profiles.filter(profile => profile.username != action.payload.username)
                chatroom.is_online = chatroom.otherProfiles.filter(profile => profile.is_online).length > 0;
                if (chatroom.profiles.length == 2) {
                    chatroom.chatroom_name = chatroom.profiles[0].username === action.payload.username ?
                        chatroom.profiles[1].username : chatroom.profiles[0].username;
                } else if (chatroom.profiles.length > 2) {
                    const usernames = chatroom.profiles.map(profile => profile.username);
                    chatroom.chatroom_name = usernames.join(', ');
                }
                if (chatroom.last_active) {
                    chatroom.last_active = 'Active ' + moment(chatroom.last_active).fromNow()
                }

                if (chatroom.is_have_new_chat) chatroom.info = chatroom.last_message;
                else if (chatroom.is_online) chatroom.info = 'Online now';
                else if (chatroom.last_active) chatroom.info = chatroom.last_active;
                else if (chatroom.last_message) chatroom.info = chatroom.last_message;
                else chatroom.info = '';

                chatroom.chats = [];
                chatroom.typing = [];
            }
            state.chatrooms = newChatrooms.concat(state.chatrooms);
        },
        setCurrentChatroomId(state, action) {
            state.currentChatroomId = action.payload;
        },
        updateUserStatus(state, action) {
            const username = action.payload.username;
            const status = action.payload.status;
            for (let chatroom of state.chatrooms) {
                const users = chatroom.otherProfiles.filter(profile => profile.username === username);
                if (users.length > 0) {
                    let user = users[0];
                    user.is_online = status;
                    chatroom.is_online = chatroom.otherProfiles.filter(profile => profile.is_online).length > 0;
                }
            }
        },
        setIsSeen(state, action) {
            state.isSeen = action.payload;
        },
        updateNewChat(state, action) {
            const username = action.payload.chat.profile.username;
            const chatroom = state.chatrooms.filter(chatroom => chatroom.id === action.payload.chat.chatroom)[0];
            let position = null;
            if (chatroom.chats.length > 0) {
                let lastChat = chatroom.chats[chatroom.chats.length - 1];
                if (lastChat.profile.username === username) {
                    if (lastChat.position === 'last') {
                        position = 'last';
                        lastChat.position = 'normal'
                    } else if (lastChat.position === 'single') {
                        position = 'last';
                        lastChat.position = 'first';
                    } else {
                        position = 'single';
                    }
                } else {
                    position = 'single';
                }
            } else {
                position = 'single';
            }
            let chat = action.payload.chat;
            chat.position = position;
            chatroom.info = chat.body;
            chatroom.is_have_new_chat = state.currentChatroomId === chat.chatroom ||
                username === action.payload.currentUsername ? false : true
            chatroom.chats.push(chat);
            state.chatrooms = state.chatrooms.filter(chatroom => chatroom.id != action.payload.chat.chatroom);
            state.chatrooms.unshift(chatroom);
            state.isSeen = state.chatrooms.filter(chatroom => chatroom.is_have_new_chat).length === 0;
        },
        updateIsHaveNewChat(state, action) {
            const chatroom = state.chatrooms.filter(chatroom => chatroom.id === action.payload.chatroomId)[0];
            chatroom.is_have_new_chat = action.payload.value;
            state.isSeen = state.chatrooms.filter(chatroom => chatroom.is_have_new_chat).length === 0;
        },
        updateTyping(state, action) {
            const chatroom = state.chatrooms.filter(chatroom => chatroom.id === action.payload.chatroom_id)[0];
            const username = action.payload.username;
            if (action.payload.type === 'typing') {
                if (!chatroom.typing.includes(username) && action.payload.currentUsername != username) {
                    chatroom.typing.push(username);
                }
            } else {
                chatroom.typing = chatroom.typing.filter(currentUsername => currentUsername != username);
            }
        },

        updateSeen(state, action) {
            const chatroom = state.chatrooms.filter(chatroom => chatroom.id === action.payload.chatroom_id)[0];
            const chat = chatroom.chats.filter(chat => chat.id === action.payload.last_seen_id)[0];
            const username = action.payload.username;
            if (chat.seen_profiles) {
                if (!chat.seen_profiles.filter(profile => profile.username === username).length > 0) {
                    chat.seen_profiles.push({ username: username });
                }
            } else {
                chat.seen_profiles = [{ username: username }];
            }
        },

        setChat(state, action) {
            const chatroomIndex = state.chatrooms.findIndex((chatroom => chatroom.id === action.payload.chatroomId));
            const chatroom = state.chatrooms[chatroomIndex];
            chatroom.chats = action.payload.data.results.reverse().concat(chatroom.chats);
            for (let idx = 0; idx < chatroom.chats.length; idx++) {
                let position;
                let chat = chatroom.chats[idx];
                if (idx == 0) {
                    if (idx < chatroom.chats.length - 1 && chatroom.chats[idx + 1].profile.username === chat.profile.username) {
                        position = 'first';
                    } else {
                        position = 'single';
                    }
                } else if (idx > 0 && idx < chatroom.chats.length - 1) {
                    if (chatroom.chats[idx + 1].profile.username === chat.profile.username) {
                        if (chatroom.chats[idx - 1].profile.username === chat.profile.username) {
                            position = 'normal';
                        } else {
                            position = 'first'
                        }
                    } else if (chatroom.chats[idx - 1].profile.username === chat.profile.username) {
                        position = 'last';
                    } else {
                        position = 'single';
                    }
                } else {
                    if (chatroom.chats[idx - 1].profile.username === chat.profile.username) {
                        position = 'last';

                    } else {
                        position = 'single';
                    }
                }
                chat.position = position;
            }
            state.chatroomProps[chatroom.id] = { nextUrl: action.payload.data.next };
        },
        setGettingChat(state, action) {
            state.gettingChat = action.payload;
        },
        setGettingChatrooms(state, action) {
            state.gettingChatrooms = action.payload;
        },
        appendChatroom(state, action) {
            state.chatrooms.push(action.payload);
        },
        setCreatingChatrooms(state, action) {
            state.creatingChatroom = action.payload;
        },
        setShowCreateChat(state, action) {
            state.showCreateChat = action.payload;
        },
        appendCreateUsername(state, action) {
            state.createUsernames.push(action.payload)
        },
        removeCreateUsername(state, action) {
            state.createUsernames = state.createUsernames.filter(username => username != action.payload);
        },
        resetCreateChatroom(state, action) {
            state.showCreateChat = false;
            state.creatingChatroom = false;
            state.createUsernames = [];
            state.searchingProfile = false;
            state.searchProfiles = [];
            state.searchType = 'default';
        },
        setSuggestProfiles(state, action) {
            state.suggestProfiles = action.payload;
        },
        setSearchProfiles(state, action) {
            state.searchProfiles = action.payload;
        },
        setSearchingProfile(state, action) {
            state.searchingProfile = action.payload;
        },
        setSearchType(state, action) {
            state.searchType = action.payload;
        },
    }
})

export const chatActions = chatSlice.actions;


export const callGetChatrooms = (username) => {
    const url = myConfig.hostName + '/chatroom/';
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => chatActions.setChatrooms({ data: data, username: username });
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => chatActions.setGettingChatrooms(true);
    const afterConnected = () => chatActions.setGettingChatrooms(false);
    const afterUnconnected = () => chatActions.setGettingChatrooms(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callCreateChatroom = (formData) => {
    const url = myConfig.hostName + '/chatroom/';
    const method = 'POST';
    const successHandler = (data) => chatActions.setCurrentChatroomId(data.id);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => chatActions.setCreatingChatrooms(true);
    const afterConnected = () => chatActions.setCreatingChatrooms(false);
    const afterUnconnected = () => chatActions.setCreatingChatrooms(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetChatSuggestProfiles = () => {
    const url = myConfig.hostName + '/profiles/chat/suggest/';
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => chatActions.setSuggestProfiles(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callChatSearchProfile = (keyword) => {
    const url = myConfig.hostName + `/profiles/search/${keyword}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => chatActions.setSearchProfiles(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => chatActions.setSearchingProfile(true);
    const afterConnected = () => () => chatActions.setSearchingProfile(false);
    const afterUnconnected = () => () => chatActions.setSearchingProfile(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetChat = (chatroomId) => {
    const url = myConfig.hostName + `/chatroom/${chatroomId}/chat/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => chatActions.setChat({ data: data, chatroomId: chatroomId });
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => chatActions.setGettingChat(true);
    const afterConnected = () => () => chatActions.setGettingChat(false);
    const afterUnconnected = () => () => chatActions.setGettingChat(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export const callGetMoreChat = (chatroomId, nextUrl) => {
    const url = nextUrl;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => chatActions.setChat({ data: data, chatroomId: chatroomId });
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => chatActions.setGettingChat(true);
    const afterConnected = () => () => chatActions.setGettingChat(false);
    const afterUnconnected = () => () => chatActions.setGettingChat(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSharePost = (formData) => {
    const url = myConfig.hostName + `/chatroom/share/`;
    const method = 'POST';
    const sendData = formData;
    const successHandler = (data) => toastActions.setIsShow(myConfig.sent);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => chatActions.setCreatingChatrooms(true);
    const afterConnected = () => () => chatActions.setCreatingChatrooms(false);
    const afterUnconnected = () => () => chatActions.setCreatingChatrooms(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export const callGetChatSeen = () => {
    const url = myConfig.hostName + '/chatroom/seen/';
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => chatActions.setIsSeen(data.type === 'seen');
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default chatSlice;