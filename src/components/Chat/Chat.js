import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer } from '@chatscope/chat-ui-kit-react';
import ChatSideBar from './ChatSideBar';
import ChatConversation from './ChatConversation';
import { headerActions } from '../../store/header-slice';

const Chat = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(headerActions.setPage('chat'))
  }, [])
  return <div className='center-item'>
    <div style={{
      paddingTop: '4.5rem',
      height: '45rem',
      width: '60rem',
      position: "relative"
    }}>
      <MainContainer responsive>
        <ChatSideBar />
        <ChatConversation />
      </MainContainer>
    </div>
  </div>;
}


export default Chat