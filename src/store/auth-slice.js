import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode'
import { myConfig } from '../config';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        user: null,
        token: null,
        loginError: { 'error': false, 'message': '' },
        sendingForm: false
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.loginError = { 'error': false, 'message': '' };
            localStorage.setItem('token', JSON.stringify(action.payload.token));
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            state.loginError = { 'error': false, 'message': '' };
            state.sendingForm = false;
            localStorage.removeItem('token');
            localStorage.removeItem('persist:root');
        },
        setLoginError(state, action) {
            state.loginError = action.payload;
            state.sendingForm = false;
        },
        setSendingForm(state, action) {
            state.sendingForm = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        }
    }
})

export const authActions = authSlice.actions;

export const loginUser = (username, password, navigate) => async (dispatch) => {
    dispatch(authActions.setSendingForm(true))
    const fetchHandler = async () => {
        const res = await fetch(myConfig.hostName + '/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'password': password })
        })
        const token = await res.json();
        const status = res.status
        return [token, status];
    }
    try {
        const [token, status] = await fetchHandler();
        if (status === 200) {
            dispatch(authActions.login({ 'token': token }))
            navigate('/')
        } else {
            dispatch(authActions.setLoginError({ 'error': true, 'message': 'Sorry, please double check your username and password.' }))
        }
    } catch (err) {
        dispatch(authActions.setLoginError({ 'error': true, 'message': 'Sorry, please check your internet connection.' }))
    }
    dispatch(authActions.setSendingForm(false))
}

export const logoutUser = (navigate) => async (dispatch) => {
    dispatch(authActions.logout());
    // navigate('/login');
    navigate(0);
}


export const updateToken = () => async (dispatch, getState) => {
    const refresh_token = getState().auth.token ? getState().auth.token.refresh :
        JSON.parse(localStorage.getItem('token')).refresh
    const fetchHandler = async () => {
        const res = await fetch(myConfig.hostName + '/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': refresh_token })
        })
        const token = await res.json();
        const status = res.status
        return [token, status];
    }
    try {
        const [token, status] = await fetchHandler();
        if (status === 200) {
            dispatch(authActions.login({ 'token': token }))
            localStorage.setItem('token', JSON.stringify(token))
        } else {
            dispatch(authActions.logout())
        }

    } catch (err) {
        // dispatch(authActions.logout())
        console.log('server error')
    }
}

export default authSlice;