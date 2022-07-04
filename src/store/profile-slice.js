import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        avatarUrl: '',
        displayUsername: '',
        username: '',
        name: '',
        website: '',
        bio: '',
        gender: '',
        gettingData: true,
        sendingData: false,
        editError: { 'isError': false, 'message': '' },
        editSuccess: { 'isSuccess': false, 'message': '' },
    },
    reducers: {
        setAvatarUrl(state, action) {
            state.avatarUrl = action.payload
        },
        setUsername(state, action) {
            state.username = action.payload
        },
        setName(state, action) {
            state.name = action.payload
        },
        setWebsite(state, action) {
            state.website = action.payload
        },
        setBio(state, action) {
            state.bio = action.payload
        },
        setGender(state, action) {
            state.gender = action.payload
        },
        setData(state, action) {
            state.avatarUrl = myConfig.host_name + action.payload.avatar;
            state.displayUsername = action.payload.username;
            state.username = action.payload.username;
            state.name = action.payload.name ? action.payload.name : '';
            state.website = action.payload.website ? action.payload.website : '';
            state.bio = action.payload.bio ? action.payload.bio : '';
            state.gender = action.payload.gender ? action.payload.gender : 'N';
        },
        editedSuccess(state, action) {
            state.editSuccess = { 'isSuccess': true, 'message': 'You successfully updated your profile!' };
            state.editError = { 'isError': false, 'message': '' }
        },
        editedError(state, action) {
            if (action.payload.includes('username')) {
                state.editError = { 'isError': true, 'message': 'Sorry, this username is already used.' }
            }
            else if (action.payload.includes('website')) {
                state.editError = { 'isError': true, 'message': 'Sorry, this website is not a valid url.' }
            }
            state.editSuccess = { 'isSuccess': false, 'message': '' }

        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        },
        setEditError(state, action) {
            state.editError = action.payload
        },
        setSendingData(state, action) {
            state.sendingData = action.payload;
        }
    }
})


export const profileActions = profileSlice.actions;

export const getData = () => async (dispatch, getState) => {
    const fetchHandler = async () => {
        const res = await fetch(myConfig.host_name + '/profiles/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(getState().auth.token.access)
            },
        })
        const data = await res.json();
        const status = res.status
        return [data, status];
    }
    try {
        const [data, status] = await fetchHandler();
        if (status === 200) {
            dispatch(profileActions.setData({
                avatar: data['avatar']['thumbnail_larger'],
                username: data['username'],
                name: data['name'],
                website: data['website'],
                bio: data['bio'],
                gender: data['gender']
            }))
        } else {
            alert('Please try again in a moment.')
        }
    } catch (err) {
        alert('Please try again in a moment.')
    }
    dispatch(profileActions.setGettingData(false))
}

export const submitData = (formData) => async (dispatch, getState) => {
    dispatch(profileActions.setSendingData(true))
    const fetchHandler = async () => {
        const res = await fetch(myConfig.host_name + '/profiles/', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + String(getState().auth.token.access),
            },
            body: formData
        })
        const data = await res.json();
        const status = res.status
        return [data, status];
    }
    try {
        const [data, status] = await fetchHandler();
        if (status === 200) {
            dispatch(profileActions.setData({
                avatar: data['avatar']['thumbnail_larger'],
                username: data['username'],
                name: data['name'],
                website: data['website'],
                bio: data['bio'],
                gender: data['gender']
            }))
            dispatch(profileActions.editedSuccess());
        } else {
            dispatch(profileActions.editedError(data))
        }
    } catch (err) {
        alert('Please try again in a moment.')
    }
    dispatch(profileActions.setSendingData(false))
}
export default profileSlice;