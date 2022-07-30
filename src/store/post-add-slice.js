import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';
import { getCroppedImg } from '../components/PostAdd/CropBody';

const postAddSlice = createSlice({
    name: 'postAdd',
    initialState: {
        type: '',
        images: [],
        croppedImages: [],
        crops: [],
        zooms: [],
        message: '',
        showMainModal: false,
        sendingData: false,
        submittedData: false,
        currentImgIndex: 0,
        imageLoaded: false,
        page: 0,
        panelWidth: 0,
        panelHeight: 0,
    },
    reducers: {
        setType(state, action) {
            state.type = action.payload;
        },
        setShowMainModal(state, action) {
            state.showMainModal = action.payload;
        },
        setMessage(state, action) {
            state.message = action.payload;
        },
        setCurrentImgIndex(state, action) {
            state.currentImgIndex = action.payload;
        },
        setCroppedImg(state, action) {
            state.croppedImages[state.currentImgIndex] = action.payload;
        },
        setCroppedImages(state, action) {
            state.croppedImages = action.payload;
        },
        setCrop(state, action) {
            state.crops[state.currentImgIndex] = action.payload;
        },
        setZoom(state, action) {
            state.zooms[state.currentImgIndex] = action.payload;
        },
        setSendingData(state, action) {
            state.sendingData = action.payload;
        },
        setSubmittedData(state, action) {
            state.submittedData = action.payload;
        },
        closeMainModal(state, action) {
            state.type = '';
            state.showMainModal = false;
            state.currentImgIndex = 0;
            state.sendingData = false;
            state.submittedData = false;
            state.images = [];
            state.croppedImages = [];
            state.crops = [];
            state.zooms = [];
            state.message = '';
            state.imageLoaded = false;
            state.page = 0;
        },
        addImage(state, action) {
            state.images.push(action.payload.image);
            state.croppedImages.push(null);
            state.crops.push({ x: 0, y: 0 });
            state.zooms.push(1);
            if (action.payload.isLast) {
                state.imageLoaded = true;
            }
        },
        setPage(state, action) {
            state.page = action.payload;
        },
        setImageLoaded(state, action) {
            state.imageLoaded = action.payload;
        },
        setPanelSize(state, action) {
            state.panelHeight = action.payload.height;
            state.panelWidth = action.payload.width;
        },
    }
})


export const postAddActions = postAddSlice.actions;

export const callPostAdd = (formData) => {
    const url = myConfig.hostName + '/posts/';
    const method = 'POST';
    const successHandler = (data) => postAddActions.setSubmittedData(true);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => postAddActions.setSendingData(true);
    const afterConnected = () => postAddActions.setSendingData(false);
    const afterUnconnected = () => postAddActions.setSendingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callStoryAdd = (formData) => {
    const url = myConfig.hostName + '/stories/';
    const method = 'POST';
    const successHandler = (data) => postAddActions.setSubmittedData(true);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => postAddActions.setSendingData(true);
    const afterConnected = () => postAddActions.setSendingData(false);
    const afterUnconnected = () => postAddActions.setSendingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const cropRemaining = (croppedImages, images) => async (dispatch) => {
    const fullCroppedImages = await Promise.all(croppedImages.map(async (img, index) => {
        if (img) return img;
        const currentImg = images[index];
        let croppedAreaPixels;
        if (currentImg.width > currentImg.height) {
            croppedAreaPixels = {
                width: currentImg.height,
                height: currentImg.height,
                x: Math.floor((currentImg.width - currentImg.height) / 2),
                y: 0
            }
        }
        else {
            croppedAreaPixels = {
                width: currentImg.width,
                height: currentImg.width,
                y: Math.floor((currentImg.height - currentImg.width) / 2),
                x: 0
            }
        }
        const croppedImg = getCroppedImg(currentImg, croppedAreaPixels);
        return croppedImg;
    }));
    dispatch(postAddActions.setCroppedImages(fullCroppedImages));
}
export default postAddSlice;