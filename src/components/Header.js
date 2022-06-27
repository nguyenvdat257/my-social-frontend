import React, { useState, useRef } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { GrHomeRounded, G } from 'react-icons/gr'
import { RiMessengerLine, RiMessengerFill, RiHomeLine, RiHomeFill } from 'react-icons/ri'
import { BsFillPlusSquareFill, BsSearch } from 'react-icons/bs'
import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs'
import { AiOutlineCompass, AiFillCompass, AiOutlineHeart, AiFillHeart, AiOutlineSetting } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { FiBookmark } from 'react-icons/fi'
import { Popover, Overlay } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import { pageActions } from "../store/page-slice";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const targetMenu = useRef(null);
  const targetNoti = useRef(null);
  const targetAdd = useRef(null);
  const page = useSelector(state => state.page.page);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const switchPage = (page) => {
    dispatch(pageActions.switchPage({ page }));
  };
  return (
    <div>
      <div className="row row-header align-items-center">
        <div className="col-3 offset-1 header-app-name">
          My Social Net
        </div>
        <div className="col-3 header-search">
          <InputGroup>
            <InputGroup.Text id="basic-addon1"><BsSearch /></InputGroup.Text>
            <FormControl
              placeholder="Search"
              type="search"
              aria-label="Search"
            />
          </InputGroup>
        </div>

        {isLoggedIn &&
          <div className='col-2 offset-1'>
            <div className='row'>
              {/* home */}
              <div className='col-2' onClick={() => switchPage('home')} >
                {page === 'home' && !showMenu && !showAdd && !showNoti ?
                  (<RiHomeFill size={24} className='header-item' />) :
                  (<RiHomeLine size={24} className='header-item' />)
                }
              </div>
              {/* chat */}
              <div className='col-2' onClick={() => switchPage('chat')} >
                {page === 'chat' && !showMenu && !showAdd && !showNoti ?
                  (<RiMessengerFill size={26} className='header-item' />) :
                  (<RiMessengerLine size={26} className='header-item' />)
                }
              </div>
              {/* add */}
              <div className='col-2' ref={targetAdd} onClick={() => setShowAdd(!showAdd)} >
                {showAdd && <BsPlusSquareFill size={24} className='header-item' />}
                {!showAdd && <BsPlusSquare size={24} className='header-item' />}
              </div>
              {/* suggest */}
              <div className='col-2' onClick={() => switchPage('suggest')} >
                {page === 'suggest' && !showMenu && !showAdd && !showNoti ?
                  (<AiFillCompass size={26} className='header-item' />) :
                  (<AiOutlineCompass size={26} className='header-item' />)
                }
              </div>
              {/* noti */}
              <div className='col-2' ref={targetNoti} onClick={() => setShowNoti(!showNoti)} >
                {showNoti && <AiFillHeart size={26} className='header-item' />}
                {!showNoti && <AiOutlineHeart size={26} className='header-item' />}
              </div>
              {/* avatar */}
              <div className='col-2'>
                <img ref={targetMenu} src="avatar.jpg" alt="Avatar"
                  className={`header-item header-avatar ${showMenu ? 'border-around' : ''}`}
                  onClick={() => setShowMenu(!showMenu)}></img>
              </div>
              <Overlay target={targetAdd.current} show={showAdd} placement='bottom' rootClose onHide={() => setShowAdd(false)}>
                <Popover className='header-menu'>
                  <div className='header-menu-item'> Add </div>
                </Popover>
              </Overlay>
              <Overlay target={targetNoti.current} show={showNoti} placement='bottom' rootClose onHide={() => setShowNoti(false)}>
                <Popover className='header-menu'>
                  <div className='header-menu-item'> Notification </div>
                </Popover>
              </Overlay>
              <Overlay target={targetMenu.current} show={showMenu} placement='bottom' rootClose onHide={() => setShowMenu(false)}>
                <Popover className='header-menu'>
                  <div className='header-menu-item'><CgProfile /> Profile </div>
                  <div className='header-menu-item'><FiBookmark /> Saved </div>
                  <div className='header-menu-item header-menu-last-item'><AiOutlineSetting /> Settings </div>
                  <div className='header-menu-item'>Logout</div>
                </Popover>
              </Overlay>
            </div>
          </div>
        }
        {!isLoggedIn &&
          <div className='col-2 offset-2'>
            <Button className='header-btn-login' variant='primary'>Log In</Button>
            <Button className='header-btn-signup' variant='light'>Sign Up</Button>
          </div>
        }
    </div>
    </div >
  )
}

export default Header