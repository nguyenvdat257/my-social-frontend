import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';

const postAddSlice = createSlice({
    name: 'postAdd',
    initialState: {
        images: [],
        showMainModal: false,
        imageLoaded: false,
        page: 0,
        panelWidth: 0,
        panelHeight: 0,
    },
    reducers: {
        setShowMainModal(state, action) {
            state.showMainModal = action.payload;
        },
        closeMainModal(state, action) {
            state.showMainModal = false;
            state.images = [];
            state.imageLoaded = false;
            state.page = 0;
        },
        addImage(state, action) {
            state.images.push(action.payload.image);
            if (action.payload.isLast){
                state.imageLoaded = true;
            }
        },
        setPage(state, action) {
            state.page = action.payload;
        },
        setImageLoaded(state, action) {
            state.imageLoaded = action.payload;
        },
        setPanelSize(state, action){
            state.panelHeight = action.payload.height;
            state.panelWidth = action.payload.width;
        }
    }
})


export const postAddActions = postAddSlice.actions;


export default postAddSlice;