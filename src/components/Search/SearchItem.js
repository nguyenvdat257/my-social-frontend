import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { callDeleteSearch, callUpdateSearch } from '../../store/search-slice';
import { CloseButton } from 'react-bootstrap';
import ProfileAvatar from '../Common/ProfileAvatar';
import TagAvatar from '../Common/TagAvatar';
import { useNavigate } from 'react-router-dom';
import { clickActions } from '../../store/click-slice';


const SearchItem = ({ item, searchId, type, setShowSearch }) => {
    const dispatch = useDispatch();
    const closeButtonRef = useRef(null);
    const avatarRef = useRef(null);
    const navigate = useNavigate();
    const handleClickDelete = e => {
        dispatch(callDeleteSearch(searchId))
    }
    const handleClickItem = e => {
        // check not click on close button
        if (!closeButtonRef.current || !closeButtonRef.current.contains(e.target)) {
            let data = {}
            const search_type = type === 'tag' ? 'search_hashtag' : 'search_profile';
            data[search_type] = item.id
            dispatch(callUpdateSearch(data));
            dispatch(clickActions.setIsClickable(true));
            setShowSearch(false);
            if (type === 'profile') {
                if (!avatarRef.current || !avatarRef.current.contains(e.target)) {
                    navigate(`/profiles/${item.username}`);
                }
            }
            if (type === 'tag') {
                navigate(`/posts/tag/${item.body}`);
            }
        }
    };
    return (
        <div className='modal-item search-item pointer-cursor' onClick={handleClickItem}>
            <div ref={avatarRef}>
                {type === 'profile' &&
                    <ProfileAvatar profile={item} avatarSize='medium' isShowDetail={true} margin='0.5rem' isEnableHover={false} />
                }
                {type === 'tag' &&
                    <TagAvatar tag={item} avatarSize='medium' margin='0.5rem' />
                }
            </div>
            {searchId &&
                <div ref={closeButtonRef} className='pointer-cursor' style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }} onClick={handleClickDelete}>
                    <CloseButton style={{ width: '0.1rem', height: '0.1rem' }} />
                </div>
            }
        </div>
    )
}

export default SearchItem