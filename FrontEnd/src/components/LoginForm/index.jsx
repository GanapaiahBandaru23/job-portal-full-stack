

import React, { useState } from 'react'

import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const LoginForm = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [loginError, setLoginError] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()


  // Email validation
  const validateEmail = () => {

    if (email.trim() === '') {
      setEmailError('Required')

    } else if (!email.endsWith('@gmail.com')) {
      setEmailError('Enter a valid Gmail address')

    } else {
      setEmailError('')
    }

  }


  // Password validation
  const validatePassword = () => {

    if (password === '') {
      setPasswordError('Required')

    } else {
      setPasswordError('')
    }

  }


  // Login Success
  const onSubmitSuccess = jwtToken => {

    Cookies.set('jwt_token', jwtToken, {
      expires: 30
    })
    console.log('Saved token:', Cookies.get('jwt_token'))

    setSuccess(true)

    navigate('/', { replace: true })
  }


  // Login Failure
  const onSubmitFailure = errorMsg => {

    setLoginError(
      errorMsg || 'This user is not registered'
    )

  }


  // Login
  const handleSubmit = async event => {

    event.preventDefault()

    validateEmail()
    validatePassword()

    setLoginError('')


    // Stop if validation fails
    if (
      email.trim() === '' ||
      !email.endsWith('@gmail.com') ||
      password === ''
    ) {
      return
    }


    const userDetails = {
      email,
      password
    }


    const url = 'http://localhost:3000/login'


    const options = {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(userDetails)
    }


    try {

      const response = await fetch(url, options)

      const data = await response.json()


      if (response.ok === true) {

        
        console.log('TOKEN FROM BACKEND:', data.token)

        onSubmitSuccess(data.token)

      } else {

        onSubmitFailure(
          data.error_msg || 'This user is not registered'
        )

      }

    } catch (error) {

      console.log(error)

      setLoginError('Server error')

    }

  }


  return (

    <div className="login-page">

      <div className="login-card">

        {!success ? (

          <>

            <h1>Login</h1>

            <p className="subtitle">
              Login to your account
            </p>


            <form onSubmit={handleSubmit}>

              {/* Gmail */}

              <div className="input-group">

                <label htmlFor="email">
                  Gmail
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your Gmail"
                  value={email}
                  onChange={event =>
                    setEmail(event.target.value)
                  }
                  onBlur={validateEmail}
                />

                {emailError && (
                  <p className="error-message">
                    {emailError}
                  </p>
                )}

              </div>


              {/* Password */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-input">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={event =>
                      setPassword(event.target.value)
                    }
                    onBlur={validatePassword}
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword
                      ? '🙈'
                      : '👁️'}
                  </button>

                </div>

                {passwordError && (
                  <p className="error-message">
                    {passwordError}
                  </p>
                )}

              </div>


              {/* Backend Error */}

              {loginError && (

                <div>

                  <p className="error-message">
                    {loginError}
                  </p>


                  {/* Register Button */}

                  <button
                    type="button"
                    className="register-button"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </button>

                </div>

              )}


              {/* Login Button */}

              <button
                type="submit"
                className="login-button"
              >
                Login
              </button>


              {/* Register */}

              <p>
                Don't have an account?{' '}

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>

              </p>

            </form>

          </>

        ) : (

          <div className="success-container">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Login Successful
            </h2>

            <p>
              Welcome back!
            </p>

          </div>

        )}

      </div>

    </div>

  )

}

export default LoginForm
