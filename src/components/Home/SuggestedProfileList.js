import React from 'react'
import ProfileItem from './ProfileItem'

const SuggestedProfileList = ({ profileSuggests, profileSuggestLoaded }) => {
    return (
        <div>
            <div className='fade-text-medium bold-text' style={{ marginTop: '1rem' }}>Suggestions For You</div>
            <div style={{ marginTop: '0.5rem', paddingRight: '1rem' }}>
                {profileSuggestLoaded &&
                    profileSuggests.slice(0, 5).map((profile, index) => (
                        <ProfileItem key={index} profile={profile} />
                    ))
                }
            </div>
        </div>
    )
}

export default SuggestedProfileList