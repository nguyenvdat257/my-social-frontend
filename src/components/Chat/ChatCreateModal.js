import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, CloseButton, Form } from 'react-bootstrap'
import { callChatSearchProfile, callCreateChatroom, callGetChatSuggestProfiles, callSharePost, chatActions } from '../../store/chat-slice';
import SuggestUsernameItem from './SuggestUsernameItem';
import MySpinner from '../Common/Spinner';

const ChatCreateModal = ({ type = 'create', post = null, setShow = null }) => {
  const dispatch = useDispatch();
  const showCreateChat = useSelector(state => state.chat.showCreateChat);
  const usernames = useSelector(state => state.chat.createUsernames);
  const creatingChatroom = useSelector(state => state.chat.creatingChatroom);
  const searchingProfile = useSelector(state => state.chat.searchingProfile);
  const [searchText, setSearchText] = useState('');
  const defaultSuggestProfiles = useSelector(state => state.chat.suggestProfiles);
  const profiles = useSelector(state => state.chat.searchType === 'default' ?
    state.chat.suggestProfiles : state.chat.searchProfiles);
  const handleCloseModal = e => {
    dispatch(chatActions.setShowCreateChat(false));
    dispatch(chatActions.resetCreateChatroom());
  }
  const handleClickNext = e => {
    if (type === 'create') {
      dispatch(callCreateChatroom(JSON.stringify({ usernames: usernames })));
    } else {
      const formData = JSON.stringify({
        usernames: usernames,
        message: '',
        share_post_img: post.images[0].image,
        share_post_code: post.code,
      })
      dispatch(callSharePost(formData));
      setShow(false);
    }
    dispatch(chatActions.resetCreateChatroom());
  };
  const handleChangeSearchText = e => {
    setSearchText(e.target.value);
  };
  const handleClickRemoveUsername = username => e => {
    dispatch(chatActions.removeCreateUsername(username));
  };
  // useEffect(() => {
  //   if (!creatingChatroom) {
  //     dispatch(chatActions.resetCreateChatroom());
  //   }
  // }, [creatingChatroom]);
  useEffect(() => {
    if (searchText.length > 0) {
      dispatch(chatActions.setSearchType('search'));
      dispatch(callChatSearchProfile(searchText));
    }
    else if (searchText.length === 0) {
      if (defaultSuggestProfiles.length === 0) {
        dispatch(callGetChatSuggestProfiles());
      }
      dispatch(chatActions.setSearchType('default'));
    }
  }, [searchText]);
  return (
    <Modal centered show={showCreateChat} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
      <div className='modal-custom-header'>
        <div className='pointer-cursor' onClick={handleCloseModal} style={{ paddingLeft: '0.5rem' }}><CloseButton /></div>
        <div className='bold-text-medium'>{type === 'create' ? 'New message' : 'Share'}</div>
        <div className='pointer-cursor' style={{ paddingRight: '1rem', color: 'dodgerblue' }} onClick={handleClickNext}>Next</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0.7rem', width: '25rem', height: '27rem' }}>
        <div className='center-item-horizontal border-bottom' style={{ maxHeight: '50%', overflowY: 'auto', paddingBottom: '1rem' }}>
          <div className='bold-text-small' style={{ width: '10%' }}>To:</div>
          <div style={{ width: '90%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                usernames.map((username, index) => (
                  <div className='create-chat-username smaller-text center-item-spacing' style={{ marginRight: '0.5rem' }}>
                    <div>{username}</div>
                    <div className='pointer-cursor' style={{ marginLeft: '0.5rem' }} onClick={handleClickRemoveUsername(username)}>✕</div>
                  </div>
                ))
              }
            </div>
            <Form style={{ width: '100%' }}>
              <Form.Control value={searchText} className='shadow-none' type='search' style={{ border: '0', resize: 'none', overflow: 'auto' }}
                onChange={handleChangeSearchText} placeholder="Search..." />
            </Form>
          </div>
        </div>
        {searchingProfile &&
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MySpinner />
          </div>
        }
        {!searchingProfile &&
          <div style={{ overflowY: 'auto' }}>
            <div className='bold-text-small' style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>Suggested</div>
            <div>
              {
                profiles.map((profile, index) => (
                  <SuggestUsernameItem key={index} profile={profile} />
                ))
              }

            </div>
          </div>
        }
      </div>
    </Modal>
  )
}

export default ChatCreateModal