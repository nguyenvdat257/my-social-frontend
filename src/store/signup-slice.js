import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode'
import { myConfig } from '../config';
import { authActions } from './auth-slice'

const signupSlice = createSlice({
    name: 'signup',
    initialState: {
        errorField: [],
        validField: [],
        error: { 'isError': false, 'message': '' },
        sendingForm: false
    },
    reducers: {
        setError(state, action) {
            if (action.payload.includes('email')) {
                state.error = { 'isError': true, 'message': 'Sorry, please double check your email.' }
            }
            else if (action.payload.includes('username')) {
                state.error = { 'isError': true, 'message': 'Sorry, please double check your username.' }
            }
        },
        validated(state, action) {
            const type = action.payload.type
            const is_error = action.payload.is_error
            if (is_error) {
                let index = state.errorField.indexOf(type);
                if (index === -1) { // push field if not exist
                    state.errorField.push(type);
                }
                index = state.validField.indexOf(type);
                if (index > -1) { // remove field if exist
                    state.validField.splice(index, 1);
                }
            } else {
                let index = state.errorField.indexOf(type);
                if (index > -1) { // remove field if exist
                    state.errorField.splice(index, 1); // 2nd parameter means remove one item only
                }
                index = state.validField.indexOf(type);
                if (index === -1) { // push field if not exist
                    state.validField.push(type);
                }
            }
        },
        setSendingForm(state, action) {
            state.sendingForm = action.payload
        },
        signedUp(state, action) {
            state.errorField = []
            state.validField = []
            state.error = { 'error': false, type: '', 'message': '' }
        },
    }
})

export const signupActions = signupSlice.actions;

export const signUp = (signupInfo, navigate) => async (dispatch) => {
    dispatch(signupActions.setSendingForm(true))
    const fetchHandler = async () => {
        const res = await fetch(myConfig.hostName + '/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupInfo)
        })
        const result = await res.json();
        const status = res.status
        return [result, status];
    }
    try {
        const [result, status] = await fetchHandler();
        if (status === 200) {
            dispatch(authActions.login({ 'user': jwt_decode(result.access), 'token': result }))
            dispatch(signupActions.signedUp())
            navigate('/')
        } else if (status == 400) {
            dispatch(signupActions.setError(result))
        } else {
            alert('Cannot connect to server')
        }
    } catch (err) {
        alert('Cannot connect to server')
    }
    dispatch(signupActions.setSendingForm(false))
}

export const validate = (signupInfo, type) => async (dispatch) => {
    const fetchHandler = async () => {
        const res = await fetch(myConfig.hostName + '/signup/validate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupInfo)
        })
        const result = await res.json();
        const status = res.status
        return [result, status];
    }
    try {
        const [result, status] = await fetchHandler();
        if (status === 200 || status === 400) {
            dispatch(signupActions.validated({ type, is_error: result.includes(type) }))
        } else {
            alert('Cannot connect to server')
        }
    } catch (err) {
        alert('Cannot connect to server')
    }
}
export default signupSlice;