import { createSlice } from '@reduxjs/toolkit';
import { toastActions } from './toast-slice';
import { callApi } from './actions';
import { myConfig } from '../config';
import { createPostSlice } from './create-postslice-wrapper';
import { postActions } from './post-timeline-slice';

const postSlice = createPostSlice('post');

export default postSlice;

