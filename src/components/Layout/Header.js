import React, { useState, useRef, useEffect } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { RiMessengerLine, RiMessengerFill, RiHomeLine, RiHomeFill } from 'react-icons/ri'
import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs'
import { AiOutlineCompass, AiFillCompass, AiOutlineHeart, AiFillHeart, AiOutlineSetting } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { FiBookmark } from 'react-icons/fi'
import { Popover, Overlay } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import { updateToken, logoutUser } from '../../store/auth-slice'
import { Link, useNavigate } from 'react-router-dom'
import { myConfig } from '../../config';
import PostAddModal from '../PostAdd/PostAddModal'
import { postAddActions } from '../../store/post-add-slice'
import MyAvatar from '../Common/MyAvatar'
import Search from '../Search/Search'
import Notification from '../Notification/Notification'
import { callGetNotificationSeen, notificationActions } from '../../store/notification-slice'
import { callGetCurrentProfile } from '../../store/profile-actions'
import { headerActions } from '../../store/header-slice'
import { callGetChatSeen } from '../../store/chat-slice'

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const showNoti = useSelector(state => state.notification.showNoti);
  const [showAdd, setShowAdd] = useState(false);
  const avatarSrc = useSelector(state => state.auth.user?.avatar.thumbnail ?
    myConfig.hostName + state.auth.user.avatar.thumbnail : myConfig.defaultAvatar);
  const targetMenu = useRef(null);
  const targetAdd = useRef(null);
  const page = useSelector(state => state.header.page);
  const user = useSelector(state => state.auth.user);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const isChatSeen = useSelector(state => state.chat.isSeen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClickHome = e => {
    navigate('/');
  }
  const setPage = (page) => {
    dispatch(headerActions.setPage(page));
  };
  const handleClickAdd = e => {
    setShowAdd(!showAdd);
  };

  const handleClickAddPost = e => {
    setShowAdd(false);
    dispatch(postAddActions.setType('post'));
    dispatch(postAddActions.setShowMainModal(true));
  };

  const handleClickAddStory = e => {
    setShowAdd(false);
    dispatch(postAddActions.setType('story'));
    dispatch(postAddActions.setShowMainModal(true));
  };

  useEffect(() => {
    let fourMinutes = 1000 * 60 * 4
    let interval = setInterval(() => {
      if (isLoggedIn) dispatch(updateToken())
    }, fourMinutes)
    dispatch(callGetCurrentProfile());
    dispatch(callGetNotificationSeen());
    dispatch(callGetChatSeen());
    return () => clearInterval(interval)
  }, []);
  return (
    <>
      <div className='sticky-header' >
        <div className="row row-header align-items-center" >
          <div className="col-2 offset-2 header-app-name" onClick={handleClickHome} >
            My Social Net
          </div>
          <div className="col-2 offset-1 header-search" style={{ position: 'relative', width: '20rem', pointerEvents: 'auto' }}>
            <Search />
          </div>

          {isLoggedIn &&
            <div className='col-2 offset-1'>
              <div className='row'>
                {/* home */}
                <div className='col-2' >
                  <Link to='/' className='link'>
                    {page === 'home' && !showMenu && !showAdd && !showNoti ?
                      (<RiHomeFill size={24} className='header-item' />) :
                      (<RiHomeLine size={24} className='header-item' />)
                    }
                  </Link>
                </div>
                {/* chat */}
                <div className='col-2' >
                  <Link to='/direct/inbox' className='link'>
                    <div style={{ position: 'relative', height: 'fit-content', width: 'fit-content' }} >
                      {page === 'chat' && !showMenu && !showAdd && !showNoti ?
                        (<RiMessengerFill size={26} className='header-item pointer-cursor' />) :
                        (<RiMessengerLine size={26} className='header-item pointer-cursor' />)
                      }
                      {!isChatSeen &&
                        <div className='indicator' style={{ position: 'absolute', bottom: '0%', left: '50%' }}></div>
                      }
                    </div>
                  </Link>
                </div>
                {/* add */}
                <div className='col-2' ref={targetAdd} onClick={handleClickAdd} >
                  {showAdd && <BsPlusSquareFill size={24} className='header-item pointer-cursor' />}
                  {!showAdd && <BsPlusSquare size={24} className='header-item pointer-cursor' />}
                </div>
                {/* explore */}
                <div className='col-2'>
                  <Link to='/explore' className='link'>
                    {page === 'explore' && !showMenu && !showAdd && !showNoti ?
                      (<AiFillCompass size={26} className='header-item pointer-cursor' />) :
                      (<AiOutlineCompass size={26} className='header-item pointer-cursor' />)
                    }
                  </Link>
                </div>
                {/* noti */}
                <div className='col-2' style={{ position: 'relative' }}>
                  <Notification />
                </div>
                {/* avatar */}
                <div className='col-2'>
                  <img ref={targetMenu} src={avatarSrc} alt="Avatar"
                    className={`header-item avatar avatar-small ${showMenu ? 'border-around' : ''} pointer-cursor`}
                    onClick={() => setShowMenu(!showMenu)}></img>
                </div>
                <Overlay target={targetAdd.current} show={showAdd} placement='bottom' rootClose onHide={() => setShowAdd(false)}>
                  <Popover className='header-menu'>
                    <div className='header-menu-item pointer-cursor' onClick={handleClickAddPost}> Add Post </div>
                    <div className='header-menu-item pointer-cursor' onClick={handleClickAddStory}> Add Story </div>
                  </Popover>
                </Overlay>
                {/* <Overlay target={targetNoti.current} show={showNoti} placement='bottom' rootClose onHide={() => setShowNoti(false)}>
                  <Popover className='header-menu'>
                    <div className='header-menu-item'> Notification </div>
                  </Popover>
                </Overlay> */}
                <Overlay target={targetMenu.current} show={showMenu} placement='bottom' rootClose onHide={() => setShowMenu(false)}>
                  <Popover className='header-menu' onClick={() => { setShowMenu(false); setPage(''); }} >
                    <Link to={`/profiles/${user?.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <div className='header-menu-item'><CgProfile /><span> Profile</span> </div>
                    </Link>
                    <Link to={`/profiles/${user?.username}/saved`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <div className='header-menu-item'><FiBookmark /><span> Saved</span> </div>
                    </Link>
                    <Link to='/accounts/edit' style={{ color: 'inherit', textDecoration: 'none' }}>
                      <div className='header-menu-item header-menu-last-item'><AiOutlineSetting />
                        <span> Settings</span>
                      </div>
                    </Link>
                    <div className='header-menu-item pointer-cursor' onClick={() => dispatch(logoutUser(navigate))}>
                      <span> Logout</span>
                    </div>
                  </Popover>
                </Overlay>
              </div>
            </div>
          }
          {!isLoggedIn &&
            <div className='col-2 offset-2'>
              <Link to='/login' style={{ color: 'inherit', textDecoration: 'none' }}>
                <Button className='header-btn-login' variant='primary'>Log In</Button>
              </Link>
              <Link to='/signup' style={{ color: 'inherit', textDecoration: 'none' }}>
                <Button className='header-btn-signup' variant='light'>Sign Up</Button>
              </Link>
            </div>
          }
        </div>
      </div >
      <PostAddModal />
    </>
  )
}

export default Header