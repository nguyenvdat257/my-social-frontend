import React from 'react'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from '../store/auth-actions';
import { useState, useEffect } from 'react';
import { authActions, loginUser } from "../store/auth-slice";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  const loginError = useSelector(state => state.auth.loginError);
  const sendingForm = useSelector(state => state.auth.sendingForm);
  let [formValid, setFormValid] = useState(false)
  let handleChangeUsername = e => setUsername(e.target.value);
  let handleChangePassword = e => setPassword(e.target.value);
  useEffect(() => {
    if (username.length > 0 && password.length > 4)
      setFormValid(true)
    else
      setFormValid(false)
  }, [username, password]);
  let onFormSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(username, password, navigate));
  }
  return (
    <div className='vh-100' style={{ background: '#fafafa' }}>
      <div className="row mb-4 pt-5">
        <div className="col-4 offset-4" >
          <Card>
            <Card.Body className='p-5 text-center'>
              <h1 style={{ "fontFamily": "Brush Script MT" }} className='mb-5'>My Social Net</h1>
              <Form onSubmit={onFormSubmit}>
                <Form.Group className="mb-2 ml-2">
                  <Form.Control type="text" value={username} onChange={handleChangeUsername} placeholder="Username" />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Control type="password" value={password} onChange={handleChangePassword} placeholder="Password" aria-describedby='hide' />
                </Form.Group>
                <Button className='btn btn-primary btn-block w-100' type="submit" disabled={sendingForm || !formValid}>
                  {sendingForm ?
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> : <div>Log In</div>}
                </Button>
              </Form>
              {loginError.error && <div className='mt-4' style={{ 'color': 'red' }}>{loginError.message}</div>}
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-4 offset-4" >
          <Card>
            <Card.Body className='text-center'>
              Don't have an account? 
              <Link to='/signup' style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                <span> Sign up</span>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login