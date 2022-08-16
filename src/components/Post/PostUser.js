import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { callGetPostAndRecent } from '../../store/postuser-slice'
import PostMainBody from './PostMainBody'
import PostList from './PostList.'
import { postUserActions } from '../../store/post-timeline-slice'
import MySpinner from '../Common/Spinner'

const PostUser = () => {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postUser.posts);
    const gettingData = useSelector(state => state.postUser.gettingData);
    const { postCode } = useParams();

    useEffect(() => {
        dispatch(callGetPostAndRecent(postCode));
        return () => dispatch(postUserActions.resetState());
    }, [postCode])
    return (
        <>
            {gettingData &&
                <div className='center-item' style={{ position: 'relative', width: '100%', height: '100%', paddingTop: '5.5rem' }}>
                    <MySpinner />
                </div>
            }
            {posts.length > 0 && !gettingData &&
                <>
                    <div className='center-item' style={{ width: '100%', height: '100%', paddingTop: '5.5rem' }}>
                        <div className='center-item border-bottom' style={{ width: 'fit-content', height: '100%', paddingBottom: '5rem' }}>
                            <PostMainBody post={posts[0]} type='postUser' />
                        </div>
                    </div>


                    <div className='center-item' style={{ marginTop: '2rem', paddingBottom: '5rem' }}>
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <span className='fade-text-medium bold-text'>More posts from </span>
                                <Link to={`/profiles/${posts[0].profile_info?.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <span className='bold-text-small pointer-cursor'>{posts[0].profile_info?.username}</span>
                                </Link>
                            </div>
                            <PostList posts={posts.slice(1, posts.length)} type='postUser' isClickOpenModal={false} />
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default PostUser