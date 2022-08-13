import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileAvatar from '../Common/ProfileAvatar';
import { chatActions } from '../../store/chat-slice';
import {BsCheck} from 'react-icons/bs'



const SuggestUsernameItem = ({ profile }) => {
    const dispatch = useDispatch();
    const usernames = useSelector(state => state.chat.createUsernames);
    const isChoosen = usernames.includes(profile.username);
    const handleClickChoose = e => {
        if (!isChoosen) {
            dispatch(chatActions.appendCreateUsername(profile.username));
        } else {
            dispatch(chatActions.removeCreateUsername(profile.username));
        }
    };
    return (
        <div className='modal-item chat-suggest-item pointer-cursor' onClick={handleClickChoose}>
            <ProfileAvatar profile={profile} avatarSize='medium' isShowDetail={true}
                margin='0.5rem' isEnableHover={false} isEnableClick={false}/>
            {isChoosen &&
                <div>
                    <div className='pointer-cursor create-chat-choose center-item' >
                       <BsCheck size={20} style={{color: 'white'}}/> 
                    </div>
                </div>}
            {!isChoosen &&
                <div>
                    <div className='pointer-cursor create-chat-unchoose'>
                    </div>
                </div>}
        </div>
    )
}

export default SuggestUsernameItem