import React from 'react'
import { Card } from 'react-bootstrap'
import EditProfile from './EditProfile'
import Privacy from './Privacy'
import { useState } from 'react'

const Settings = () => {
  let [selectedField, setSelectedField] = useState('editProfile');
  return (
    <div className='contain'>
      <div className="row mb-0" style={{ 'paddingTop': '7rem', 'height': '100%' }}>
        <div className="col-2 offset-2" style={{ height: '100%', padding: 0 }} >
          <Card style={{ height: '90%', padding: 0 }}>
            <div name='editProfile'
              className={`setting-item ${selectedField === 'editProfile' ? 'setting-item-selected' : ''}`}
              onClick={() => setSelectedField('editProfile')}
            >
              Edit Profile
            </div>
            <div name='privacy'
              className={`setting-item ${selectedField === 'privacy' ? 'setting-item-selected' : ''}`}
              onClick={() => setSelectedField('privacy')}>
              Privacy
            </div>
          </Card>
        </div>
        {selectedField === 'editProfile' && <EditProfile />}
        {selectedField === 'privacy' && <Privacy />}
      </div >
    </div >
  )
}

export default Settings