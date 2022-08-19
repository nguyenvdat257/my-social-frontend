import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer } from '@chatscope/chat-ui-kit-react';
import ChatSideBar from './ChatSideBar';
import ChatConversation from './ChatConversation';
import { headerActions } from '../../store/header-slice';
import { chatActions } from '../../store/chat-slice';

const Chat = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(headerActions.setPage('chat'));
    document.title = 'Inbox • Chats';
    return () => dispatch(chatActions.setCurrentChatroomId(null));
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