import React from 'react'
import { Card } from 'react-bootstrap'
import EditProfile from './EditProfile'
import Privacy from './Privacy'
import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

const Settings = () => {
  let [selectedField, setSelectedField] = useState('editProfile');
  useEffect(() => {
    console.log('fiewo')
    const type = window.location.href.split('/').pop()
    if (type === 'edit')
      setSelectedField('editProfile')
    else
      setSelectedField('privacy')
  }, [])
  return (
    <div className="row mb-0" style={{ 'paddingTop': '7rem', 'height': '100%' }}>
      <div className="col-2 offset-2" style={{ height: '100%', padding: 0 }} >
        <Card style={{ height: '90%', padding: 0 }}>
          <Link to="edit" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div name='editProfile' className={`setting-item ${selectedField === 'editProfile' ? 'setting-item-selected' : ''}`} onClick={() => setSelectedField('editProfile')}>
              Edit Profile
            </div>
          </Link>
          <Link to="privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div name='privacy'
              className={`setting-item ${selectedField === 'privacy' ? 'setting-item-selected' : ''}`} onClick={() => setSelectedField('privacy')}>
              Privacy
            </div>
          </Link>
        </Card>
      </div>
      <Routes>
        <Route path="edit" element={<EditProfile />} />
        <Route path="privacy" element={<Privacy />} />
      </Routes>
      {/* {selectedField === 'editProfile' && <EditProfile />} */}
      {/* {selectedField === 'privacy' && <Privacy />} */}
    </div >
  )
}

export default Settings