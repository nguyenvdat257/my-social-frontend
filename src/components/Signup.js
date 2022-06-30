import React from 'react'
import { Form, Button, Card, Spinner, FormGroup, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { signUp, validate } from "../store/signup-slice";
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from 'react-icons/ai'

const Signup = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let [email, setEmail] = useState('');
  let [name, setName] = useState('');
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  const errorField = useSelector(state => state.signup.errorField);
  const validField = useSelector(state => state.signup.validField);
  const error = useSelector(state => state.signup.error);
  const sendingForm = useSelector(state => state.signup.sendingForm);
  let [formValid, setFormValid] = useState(false)
  let handleChangeEmail = e => setEmail(e.target.value);
  let handleChangeName = e => setName(e.target.value);
  let handleChangeUsername = e => setUsername(e.target.value);
  let handleChangePassword = e => setPassword(e.target.value);
  useEffect(() => {
    if (email.length > 0 && name.length > 0 && username.length > 0 && password.length > 4)
      setFormValid(true)
    else
      setFormValid(false)
  }, [username, password]);
  let onFormSubmit = e => {
    e.preventDefault();
    dispatch(signUp({ email, name, username, password }, navigate));
  }
  let onFormBlur = e => {
    e.preventDefault();
    if (e.target.value.length > 0)
      dispatch(validate({ email, name, username, password }, e.target.name));
  }
  return (
    <div className='vh-100' style={{ background: '#fafafa' }}>
      <div className="row mb-4 pt-5">
        <div className="col-4 offset-4" >
          <Card>
            <Card.Body className='p-5 text-center'>
              <h1 style={{ "fontFamily": "Brush Script MT" }} className='mb-3'>My Social Net</h1>
              <div style={{ "fontFamily": "Arial", "color": "gray" }} className='mb-4'>Sign up to see photos and videos from your friends.</div>
              <Form onSubmit={onFormSubmit}>
                <Form.Group className="mb-2 ml-2 signup-formgroup">
                  <Form.Control type="email" name='email' value={email} onBlur={onFormBlur} onChange={handleChangeEmail} placeholder="Email" />
                  {errorField.includes('email') && <AiOutlineCloseCircle size={28} className='signup-formgroup-icon icon-red' />}
                  {validField.includes('email') && <AiOutlineCheckCircle size={28} className='signup-formgroup-icon icon-green' />}
                </Form.Group>
                <Form.Group className="mb-2 ml-2 signup-formgroup">
                  <Form.Control type="text" name='name' onBlur={onFormBlur} value={name} onChange={handleChangeName} placeholder="Full Name" />
                  {validField.includes('name') && <AiOutlineCheckCircle size={28} className='signup-formgroup-icon icon-green' />}
                </Form.Group>
                <Form.Group className="mb-2 ml-2 signup-formgroup">
                  <Form.Control type="text" name='username' value={username} onBlur={onFormBlur} onChange={handleChangeUsername} placeholder="Username" />
                  {errorField.includes('username') && <AiOutlineCloseCircle size={28} className='signup-formgroup-icon icon-red' />}
                  {validField.includes('username') && <AiOutlineCheckCircle size={28} className='signup-formgroup-icon icon-green' />}
                </Form.Group>
                <Form.Group className="mb-4 signup-formgroup">
                  <Form.Control type="password" name='password' value={password} onBlur={onFormBlur} onChange={handleChangePassword} placeholder="Password" aria-describedby='hide' />
                  {errorField.includes('password') && <AiOutlineCloseCircle size={28} className='signup-formgroup-icon icon-red' />}
                  {validField.includes('password') && <AiOutlineCheckCircle size={28} className='signup-formgroup-icon icon-green' />}
                </Form.Group>
                <div style={{ "fontFamily": "Arial", "color": "gray", "fontSize": "0.8rem" }} className="mb-4">By signing up, you agree to our Terms and Policy.</div>
                <Button className='btn btn-primary btn-block w-100' type="submit" disabled={sendingForm || !formValid}>
                  {sendingForm ?
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> : <div>Sign up</div>}
                </Button>
              </Form>
              {error.isError && <div className='mt-4' style={{ 'color': 'red' }}>{error.message}</div>}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Signup