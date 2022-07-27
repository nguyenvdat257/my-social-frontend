import React, { useEffect } from 'react'
import { Form, Row, Col, Card, Modal, Button, Spinner } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef } from 'react'
import { profileActions, getData, submitData } from '../../store/profile-slice'
import MySpinner from '../Common/Spinner'

const EditProfile = () => {
  const dispatch = useDispatch()
  const avatarUrl = useSelector(state => state.profile.avatarUrl)
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const username = useSelector(state => state.profile.username);
  const displayUsername = useSelector(state => state.profile.displayUsername);
  const name = useSelector(state => state.profile.name);
  const website = useSelector(state => state.profile.website);
  const bio = useSelector(state => state.profile.bio);
  const gender = useSelector(state => state.profile.gender);
  const [showGender, setShowGender] = useState(false);
  const uploadAvatarRef = useRef(null);
  const sendingData = useSelector(state => state.profile.sendingData);
  const gettingData = useSelector(state => state.profile.gettingData);
  const editError = useSelector(state => state.profile.editError);
  const editSuccess = useSelector(state => state.profile.editSuccess);
  const handleFileChange = e => {
    const fileObj = e.target.files && e.target.files[0];
    if (!fileObj) {
      return;
    }
    setUploadedAvatar(fileObj)
  };
  const handleUploadClick = () => uploadAvatarRef.current.click()
  const handleChangeUsername = e => dispatch(profileActions.setUsername(e.target.value));
  const handleChangeName = e => dispatch(profileActions.setName(e.target.value));
  const handleChangeWebsite = e => dispatch(profileActions.setWebsite(e.target.value));
  const handleChangeBio = e => dispatch(profileActions.setBio(e.target.value));
  const handleChangeGender = e => dispatch(profileActions.setGender(e.target.value));
  const genders_radio = [
    { name: "Male", value: "M" },
    { name: "Female", value: "F" },
    { name: "Custom", value: "C" },
    { name: "Prefer not to say", value: "N" },
  ];

  const getGenderName = () => {
    const gender_item = genders_radio.filter((item) => item.value === gender)[0]
    return gender_item.name
  };

  const handleSubmit = e => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('username', username)
    formData.append('name', name)
    formData.append('website', website)
    formData.append('bio', bio)
    formData.append('gender', gender)
    if (uploadedAvatar) {
      formData.append('avatar', uploadedAvatar)
    }
    dispatch(submitData(formData));
  };
  useEffect(() => {
    dispatch(getData())
  }, []);
  useEffect(() => {
    if (uploadedAvatar) {
      const avatarUrl = URL.createObjectURL(uploadedAvatar)
      dispatch(profileActions.setAvatarUrl(avatarUrl))
    }
    return () => {
      URL.revokeObjectURL(avatarUrl)
      dispatch(profileActions.resetData())
    };
  }, [uploadedAvatar]);
  if (gettingData)
    return (
      <>
        <div className="col-6" style={{ height: '90%', padding: 0, position: 'relative' }} >
          <MySpinner />
        </div>
      </>
    )
  else
    return (
      <>
        <div className="col-6" style={{ height: '100%', padding: 0 }} >
          <Card style={{ height: '90%' }}>
            <Card.Body className='text-center pt-5' >
              <Form model="feedback" onSubmit={(values) => handleSubmit(values)}>
                <Row className="mb-3 form-group">
                  <Col md={2} className='offset-1 text-end'>
                    <img src={avatarUrl} alt="Avatar"
                      className='avatar form-avatar'
                      onClick={handleUploadClick}></img>
                  </Col>
                  <Col md={6} className='text-start'>
                    <div className='edit-profile-username'>{displayUsername}</div>
                    <div style={{ color: 'dodgerblue', fontSize: 'smaller', fontWeight: 'bold' }} onClick={handleUploadClick}>Change profile photo</div>
                    <Form.Control ref={uploadAvatarRef} onChange={handleFileChange} type="file" style={{ display: 'none' }} />
                  </Col>
                </Row>

                <Row className="mb-3 form-group">
                  <Col md={2} className='offset-1 text-end edit-profile-label'>
                    <Form.Label>Username</Form.Label>
                  </Col>
                  <Col md={6}>
                    <Form.Control defaultValue={username} onChange={handleChangeUsername} type="text" placeholder="Username" />
                  </Col>
                </Row>

                <Row className="mb-3 form-group">
                  <Col md={2} className='offset-1 text-end edit-profile-label'>
                    <Form.Label>Name</Form.Label>
                  </Col>
                  <Col md={6}>
                    <Form.Control defaultValue={name} onChange={handleChangeName} type="text" placeholder="Name" />
                  </Col>
                </Row>

                <Row className="mb-3 form-group">
                  <Col md={2} className='offset-1 text-end edit-profile-label'>
                    <Form.Label>Website</Form.Label>
                  </Col>
                  <Col md={6}>
                    <Form.Control defaultValue={website} onChange={handleChangeWebsite} type="text" placeholder="Website" />
                  </Col>
                </Row>

                <Row className="mb-3 form-group">
                  <Col md={2} className='offset-1 text-end edit-profile-label'>
                    <Form.Label>Bio</Form.Label>
                  </Col>
                  <Col md={6}>
                    <Form.Control defaultValue={bio} onChange={handleChangeBio} as="textarea" rows={3} placeholder="Bio" />
                  </Col>
                </Row>

                <Row className="mb-3 form-group">
                  <Col md={2} className='offset-1 text-end edit-profile-label'>
                    <Form.Label>Gender</Form.Label>
                  </Col>
                  <Col md={6}>
                    <div onClick={() => setShowGender(true)}>
                      <Form.Control style={{ background: 'white' }} type="text" value={getGenderName()} disabled placeholder="Gender" />
                    </div>
                  </Col>
                </Row>

                <Modal centered show={showGender} onHide={() => setShowGender(false)}>
                  <Modal.Header className='modal-title' >
                    <Modal.Title >Gender</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='p-3'>
                    <div className='mb-3'>
                      {genders_radio.map((radio, index) => (
                        <Form.Check type='radio' key={index} name='radio'>
                          <Form.Check.Label htmlFor={radio.value}>{radio.name}</Form.Check.Label>
                          <Form.Check.Input id={radio.value} type='radio' checked={gender === radio.value} value={radio.value} onChange={handleChangeGender} />
                        </Form.Check>
                      ))
                      }
                    </div>
                    <Button className='btn btn-primary btn-block w-100' onClick={() => setShowGender(false)}>
                      Done
                    </Button>
                  </Modal.Body>
                </Modal>
                <Row className="mb-3 form-group">
                  <Col md={6} className='offset-3 text-start'>
                    <Button style={{ width: '6rem' }} className='btn btn-primary btn-block' type='submit'>
                      {sendingData ?
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> : <div>Submit</div>}
                    </Button>
                  </Col>
                </Row>
              </Form>
              <Row className="mb-3 form-group">
                <Col md={6} className='offset-3 text-start'>
                  {editError.isError && <div className='mt-4' style={{ 'color': 'red' }}>{editError.message}</div>}
                  {editSuccess.isSuccess && <div className='mt-4' style={{ 'color': 'green' }}>{editSuccess.message}</div>}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div >
      </>
    )
}


export default EditProfile