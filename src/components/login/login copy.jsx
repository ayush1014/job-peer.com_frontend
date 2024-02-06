import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import api from '../../config/axios'
import { useNavigate } from 'react-router-dom';
import './login.css'

function Login() {

  const [status, setStatus] = useState(null);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate()

  async function HandleSubmit(e){
    e.preventDefault();
    const loginInfo = {
      'username': username,
      'password': password
    }

    try{
      const login = await api.post('/login', loginInfo);
      sessionStorage.setItem('User', JSON.stringify(login.data));
      console.log('successfully logged in', login);
      setStatus(true)
      navigate(`/home/${username}`)
    }catch(error){
      console.log('error: ', error)
      setStatus(false)
    }
  }
  const handleSignup = ()=>{
    navigate('/signup')
  }

  return (
    <div className='main'>
      <h1>Login</h1>
      <Form className='main-container' onSubmit={HandleSubmit}>
        <Row className="row-container">
        {<Form.Group as={Col} controlId="formGridEmail">
            <Form.Label className={status === false ? 'error-label' : ''}>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="username"
              className={status === false ? 'error-control' : ''}
              onChange={(e) => {
                setUsername(e.target.value)
              }} />
          </Form.Group>}
        </Row>

        <Row className="row-container">


          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className={status === false ? 'error-label' : ''}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              className={status === false ? 'error-control' : ''}
              onChange={(e) => {
                setPassword(e.target.value)
              }} />
          </Form.Group>
          {status === false && (
              <div className='error-message'>
                Wrong username or password <br/> Please try again !!
              </div>
            )}
        </Row>
        <Button
          className='submit-btn'
          type='submit'>
          Log In
        </Button>

        <Button
          className='submit-btn'
          onClick={handleSignup}
          >
          Sign Up
        </Button>
      </Form>
    </div>
  )
}

export default Login;