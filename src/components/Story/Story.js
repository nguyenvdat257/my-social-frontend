import React, { useState, useEffect } from 'react'
import { Card, ProgressBar, Form } from 'react-bootstrap'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { GiPauseButton } from 'react-icons/gi'
import { BsFillPlayFill } from 'react-icons/bs'
import { myConfig } from '../../config'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getData } from '../../store/story-board-slice'
import MySpinner from '../Common/Spinner'
import { storyActions, callStoryLike, callStorySeen, callGetStoryViewProfile, callStorySendReply } from '../../store/story-slice'
import ProfileListModal from '../Profile/ProfileListModal'

const Story = ({ type }) => {
    const dispatch = useDispatch()
    const [isFocusInput, setIsFocusInput] = useState(false);
    const [ reply, setReply ] = useState('');
    const { idx } = useParams();
    const origStoriesList = useSelector(state => state.storyBoard.profilesStoriesList);
    const origMyStoriesList = useSelector(state => state.storyBoard.myStories);
    const isDataFetched = useSelector(state => state.storyBoard.isDataFetched);
    const isDataReady = useSelector(state => state.story.isDataReady);
    const progress = useSelector(state => state.story.progress);
    const isPause = useSelector(state => state.story.isPause);
    const isViewAll = useSelector(state => state.story.isViewAll);
    const isFirstStory = useSelector(state => state.story.isFirstStory);
    const storyIdx = useSelector(state => state.story.storyIdx);
    const profileIdx = useSelector(state => state.story.profileIdx);
    const profile = useSelector(state => state.story.profilesStoriesList?.length > 0 ? state.story.profilesStoriesList[state.story.profileIdx][0] : null);
    const story = useSelector(state => state.story.profilesStoriesList?.length > 0 ? state.story.profilesStoriesList[state.story.profileIdx][1][state.story.storyIdx] : null);
    const stories = useSelector(state => state.story.profilesStoriesList?.length > 0 ? state.story.profilesStoriesList[state.story.profileIdx][1] : null);
    const [showViewProfile, setShowViewProfile] = useState(false);
    const navigate = useNavigate();

    const handleChangeReply = e => {
        setReply(e.target.value);
    };
    const handleChangePause = e => {
        dispatch(storyActions.setIsPause(!isPause));
    }
    const onFormSubmit = e => {
        const formData = {
            usernames: [profile.username],
            message: reply,
            reply_story_img: story['images'][0]['image'],
        }
        setReply('');
        dispatch(callStorySendReply(JSON.stringify(formData)));
    };
    const handleOnFocusInput = e => {
        setIsFocusInput(true);
        dispatch(storyActions.setIsPause(true))
    };
    const handleOnBlurInput = e => {
        setIsFocusInput(false);
        dispatch(storyActions.setIsPause(false))
    };
    const handleGoBack = e => {
        dispatch(storyActions.decrementStoryIdx())
        dispatch(storyActions.resetProgress())
    };
    const handleGoForward = e => {
        dispatch(storyActions.incrementStoryIdx())
        dispatch(storyActions.resetProgress())
    };
    const handleLike = e => {
        dispatch(callStoryLike(profileIdx, storyIdx, story['id']));
        dispatch(storyActions.setLike({ profileIdx: profileIdx, storyIdx: storyIdx, data: !story['is_like'] }))
    }
    const handleClickOutside = e => {
        if (e.target === e.currentTarget) {
            navigate('/')
        }
    }
    const handleViewCountClick = e => {
        setShowViewProfile(true);
    }
    useEffect(() => {
        if (isViewAll) {
            dispatch(storyActions.resetState());
            navigate('/');
        }
    }, [isViewAll]);
    useEffect(() => {
        if (!isDataFetched) // data not fetched (from refresh)
            dispatch(getData())
        else {
            dispatch(storyActions.setStoriesList(type === 'other' ? origStoriesList : origMyStoriesList));
            dispatch(storyActions.setIdx(parseInt(idx ? idx : 0)));
        }
    }, []);
    useEffect(() => {
        if (isDataFetched) {
            dispatch(storyActions.setStoriesList(type === 'other' ? origStoriesList : origMyStoriesList));
            dispatch(storyActions.setIdx(parseInt(idx ? idx : 0)));
        }
    }, [isDataFetched]);
    useEffect(() => {
        if (!(story === null) && story['is_seen'] === false) {
            dispatch(callStorySeen(profileIdx, storyIdx, story['id']));
        }
    }, [story]);
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(storyActions.incrementProgress())
        }, 100);
        return () => clearInterval(interval);
    }, [isDataReady]);
    useEffect(() => {
        if (progress === 105) {
            dispatch(storyActions.incrementStoryIdx())
            dispatch(storyActions.resetProgress())
        }
    }, [progress]);
    useEffect(() => {
        if (isPause) {
            dispatch(storyActions.setProgress())
        }
    }, [isPause]);
    useEffect(() => {
        if (showViewProfile)
            dispatch(storyActions.setIsPause(true));
        else
            dispatch(storyActions.setIsPause(false));
    }, [showViewProfile])
    if (!isDataReady || profile === null)
        return (
            <div className='story-contain' style={{ opacity: isFocusInput ? 0.8 : 0.9 }}>
                <Card className='story-slide'>
                    <MySpinner />
                </Card>
            </div>
        )
    else
        return (
            <div className='story-contain' style={{ opacity: isFocusInput ? 0.8 : 0.9 }} onClick={handleClickOutside}>
                <IoIosArrowBack className='story-control-button' onClick={handleGoBack} style={{ visibility: !isFirstStory ? 'visible' : 'hidden' }} />
                <Card className='story-slide' style={{ backgroundColor: 'white', borderRadius: '1rem' }}>
                    <div className='story-progress'>
                        <div className='' style={{ display: 'flex' }}>
                            {stories.map((item, index) => {
                                let currentProgress = 0;
                                if (index < storyIdx)
                                    currentProgress = 105;
                                if (index === storyIdx)
                                    currentProgress = progress;
                                return (<ProgressBar key={index} min="0" max="100" className='' now={currentProgress} style={{ width: `${100 / stories.length}%`, height: '3px', marginLeft: '3px' }} />)
                            })}
                        </div>
                        <div className='story-info'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img className='avatar avatar-large' src={profile.avatar.thumbnail_larger ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar} />
                                <div className='story-info-name'>{profile.username}</div>
                                <div className='story-info-ago fade-text'>{story['hour_ago']}h</div>
                            </div>
                            <div>
                                {!isPause && <GiPauseButton className='pointer-cursor' size='1.4rem' onClick={handleChangePause} />}
                                {isPause && <BsFillPlayFill className='pointer-cursor' size='1.6rem' onClick={handleChangePause} />}
                            </div>
                        </div>
                    </div>
                    <img className='story-image' src={myConfig.hostName + story['images'][0]['image']} />
                    {type === 'other' &&
                        <div className='story-reaction'>
                            <div className='story-form'>
                                <Form onSubmit={onFormSubmit} >
                                    <Form.Control
                                        as="textarea"
                                        value={reply} 
                                        className='shadow-none' 
                                        rows='1' 
                                        name='reply' 
                                        style={{ borderRadius: '1.5rem', resize: 'none' }} 
                                        onChange={handleChangeReply} 
                                        onFocus={handleOnFocusInput} 
                                        onBlur={handleOnBlurInput} 
                                        placeholder="Reply to " />
                                </Form>
                                {true && <div class='story-send' onClick={onFormSubmit}>Send</div>}
                            </div>
                            {story['is_like'] && <AiFillHeart className='pointer-cursor' size='1.6rem' style={{ color: 'red' }} onClick={handleLike} />}
                            {!story['is_like'] && <AiOutlineHeart className='pointer-cursor' size='1.6rem' onClick={handleLike} />}
                        </div>
                    }
                    {type === 'my' && story.view_count > 0 &&
                        <div className='story-view-count smaller-text pointer-cursor' onClick={handleViewCountClick}>
                            Seen by {story.view_count}
                        </div>

                    }
                    {showViewProfile &&
                        <ProfileListModal title='Viewers' showModal={showViewProfile} setShowModal={setShowViewProfile}
                            getData={callGetStoryViewProfile(story.id)} />}
                </Card>
                <IoIosArrowForward className='story-control-button' onClick={handleGoForward} />
            </div >
        )
}

export default Story