import { createSlice } from '@reduxjs/toolkit';

const profileModalSlice = createSlice({
    name: 'profileModal',
    initialState: {
        profiles: [],
        nextUrl: null
    },
    reducers: {
        setData(state, action) {
            state.profiles = action.payload.results;
            state.nextUrl = action.payload.next;
        },
        setNextData(state, action) {
            state.profiles = state.profiles.concat(action.payload.results);
            state.nextUrl = action.payload.next;
        },
        closeModal(state, action) {
            state.profiles = [];
            state.nextUrl = null;
        },
        setFollowData(state, action) {
            const profileIdx = state.profiles.findIndex(profile => profile.username === action.payload.username);
            const isFollow = action.payload.data.type === 'follow' ? true : false;
            state.profiles[profileIdx].is_follow = isFollow;

        },
    }
})

export const profileModalActions = profileModalSlice.actions;

export default profileModalSlice;

