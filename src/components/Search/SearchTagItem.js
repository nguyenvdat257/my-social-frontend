import React from 'react';
import { useDispatch } from 'react-redux';
import { myConfig } from '../../config';
import { callDeleteSearch, callUpdateSearch } from '../../store/search-slice';
import { CloseButton } from 'react-bootstrap';


const SearchTagItem = ({ tag,  searchId }) => {
    const dispatch = useDispatch();
    const handleClickDelete = e => {
        dispatch(callDeleteSearch(searchId))
    }
    const handleClickItem = e => {
        dispatch(callUpdateSearch({search_hashtag: tag.id}));
    };
    return (
        <div className='modal-item search-item pointer-cursor' onClick={handleClickItem}>
            <div style={{ display: 'flex' }}>
                <img className='avatar avatar-medium' src={myConfig.defaultHashtag} />
                <div className='name-avatar-margin-small'>
                    <div className='bold-text-small'>{tag.body}</div>
                    <div className='fade-text-medium'>{`${tag.post_count} ${tag.post_count > 1 ? 'posts' : 'post'}`} </div>
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

export default SearchTagItem