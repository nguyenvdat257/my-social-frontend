import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Sidebar, Search, Conversation, ConversationList, Avatar, AvatarGroup } from '@chatscope/chat-ui-kit-react';
import { myConfig } from '../../config';
import { BsPencilSquare } from 'react-icons/bs'
import CreateChatModal from './ChatCreateModal';
import { callGetChatrooms, chatActions } from '../../store/chat-slice';
import { getAvatarSrc } from '../../utils/CommonFunction';

const ChatSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const showCreateChat = useSelector(state => state.chat.showCreateChat);
  const chatrooms = useSelector(state => state.chat.chatrooms);
  const currentChatroomId = useSelector(state => state.chat.currentChatroomId);
  const handleClickCreateChat = e => {
    dispatch(chatActions.setShowCreateChat(true));
  };
  const handleClickChatroom = chatroom => e => {
    dispatch(chatActions.setCurrentChatroomId(chatroom.id));
  };
  useEffect(() => {
    dispatch(callGetChatrooms(user.username));
    // new WebSocket
  }, [])
  // useEffect(() => {
  //   alert('current chat room changes')
  // }, [currentChatroom]);
  return (
    <>
      <Sidebar position="left" scrollable={false}>
        <div className='center-item'>
          <Search placeholder="Search..." />
          <BsPencilSquare className='pointer-cursor' size={25} onClick={handleClickCreateChat} />
        </div>
        <ConversationList>
          {
            chatrooms.map((chatroom, index) => (
              <Conversation key={index} name={chatroom.chatroom_name} info={chatroom.info} unreadCnt={chatroom.is_have_new_chat ? 1 : null}
                onClick={handleClickChatroom(chatroom)} active={chatroom.id === currentChatroomId}>
                {chatroom.otherProfiles.length === 1 &&
                  <Avatar src={getAvatarSrc(chatroom.otherProfiles[0], 'small')} name={chatroom.chatroom_name}
                    status={chatroom.is_online ? 'available' : null} style={{ width: '2rem', height: '2rem' }} />
                }

                {chatroom.otherProfiles.length > 1 &&
                  <AvatarGroup size="sm" style={{
                    width: "2rem",
                    height: "2rem"
                  }} >
                    {
                      chatroom.otherProfiles.slice(0, 4).map((profile, index) => (
                        <Avatar key={index} src={getAvatarSrc(profile, 'small')} name={profile.username} />
                      ))
                    }
                  </AvatarGroup>

                }
              </Conversation>

            ))
          }

          {/* <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
            <Avatar src={myConfig.defaultAvatar} name="Lilly" status="available" />
          </Conversation>

          <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
            <Avatar src={myConfig.defaultAvatar} name="Joe" status="dnd" />
          </Conversation>

          <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
            <Avatar src={myConfig.defaultAvatar} name="Emily" status="available" />
          </Conversation> */}

        </ConversationList>
      </Sidebar>
      {showCreateChat && <CreateChatModal />}
    </>
  )
}

export default ChatSideBar