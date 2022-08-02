import React from 'react';
import { useDispatch } from 'react-redux';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { CloseButton } from 'react-bootstrap';
import { callDeleteSearch, callUpdateSearch } from '../../store/search-slice';


const SearchProfileItem = ({ profile, searchId }) => {
    const dispatch = useDispatch();
    const handleClickDelete = e => {
        dispatch(callDeleteSearch(searchId))
    };
    const handleClickItem = e => {
        dispatch(callUpdateSearch({search_profile: profile.id}));
    };
    return (
        <div className='modal-item search-item pointer-cursor' onClick={handleClickItem}>
            <div style={{ display: 'flex' }}>
                <img className='avatar avatar-medium' src={getAvatarSrc(profile, 'small')} />
                <div className='name-avatar-margin-small'>
                    <div className='bold-text-small'>{profile.username}</div>
                    <div className='fade-text-medium'>{profile.name}</div>
                </div>
            </div>
            {searchId &&
                <div className='pointer-cursor' style={{display: 'flex', alignItems: 'center', marginRight: '1rem' }} onClick={handleClickDelete}>
                    <CloseButton style={{width: '0.2rem', height: '0.2rem'}}/>
                </div>
            }
        </div>
    )
}

export default SearchProfileItem