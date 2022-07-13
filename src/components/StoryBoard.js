import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { getData } from '../store/story-board-slice'
import { useDispatch, useSelector } from 'react-redux'
import MyToast from './MyToast'
import MySpinner from './Spinner'
import { myConfig } from '../config'
import { Link } from 'react-router-dom'

const StoryBoard = () => {
  const dispatch = useDispatch();
  const unSeenProfiles = useSelector(state => state.storyBoard.unSeenProfiles);
  const seenProfiles = useSelector(state => state.storyBoard.seenProfiles);
  const gettingData = useSelector(state => state.storyBoard.gettingData);
  useEffect(() => {
    dispatch(getData());
  }, []);
  if (gettingData)
    return (
      <>
        <Card style={{ height: '6rem', padding: 0 }}>
          <MySpinner />
        </Card>
        <MyToast />
      </>
    );
  else
    return (
      <Card className='story-board'>
        <div className='d-flex flex-row' style={{ overflowX: 'auto' }}>
          {
            unSeenProfiles.concat(seenProfiles).map((profile, index) => (
              <div className='d-flex flex-column story-board-item' key={profile.username}>
                <Link to={'/stories/profiles/' + index} state={{ profileIdx: index }}>
                  <img className={`avatar story-board-avatar${index < unSeenProfiles.length ? ' story-board-outline-unseen': ''} `} src={profile.avatar.thumbnail_larger ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar} />
                </Link>
                <div className='story-board-text'>{profile.username}</div>
              </div>
            ))

            // seenProfiles.map((profile, index) => (
            //   <div className='d-flex flex-column story-board-item' key={profile.username}>
            //     <Link to={'/stories/profiles/' + index} state={{ profileIdx: index }}>
            //       <img className='avatar story-board-avatar' src={profile.avatar.thumbnail_larger ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar} />
            //     </Link>
            //     <div className='story-board-text'>{profile.username}</div>
            //   </div>
            // ))
          }
        </div>
      </Card>
    );
}

export default StoryBoard