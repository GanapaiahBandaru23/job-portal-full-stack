
import React, { useState } from 'react'

import {useNavigate} from 'react-router-dom'
import './index.css'

const RegisterForm = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()


  const validateFirstName = () => {

    if (firstName.trim() === '') {
      setFirstNameError('Required')
    } else {
      setFirstNameError('')
    }

  }


  const validateLastName = () => {

    if (lastName.trim() === '') {
      setLastNameError('Required')
    } else {
      setLastNameError('')
    }

  }


  const validateEmail = () => {

    if (email.trim() === '') {
      setEmailError('Required')

    } else if (!email.endsWith('@gmail.com')) {
      setEmailError('Enter a valid Gmail address')

    } else {
      setEmailError('')
    }

  }


  const validatePassword = () => {

    if (password === '') {
      setPasswordError('Required')

    } else if (password.length < 6) {
      setPasswordError(
        'Password must contain at least 6 characters'
      )

    } else {
      setPasswordError('')
    }

  }


  const validateConfirmPassword = () => {

    if (confirmPassword === '') {
      setConfirmPasswordError('Required')

    } else if (password !== confirmPassword) {
      setConfirmPasswordError(
        'Passwords do not match'
      )

    } else {
      setConfirmPasswordError('')
    }

  }


  const handleSubmit = async event => {

    event.preventDefault()


    validateFirstName()
    validateLastName()
    validateEmail()
    validatePassword()
    validateConfirmPassword()


    if (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.endsWith('@gmail.com') &&
      password.length >= 6 &&
      password === confirmPassword
    ) {

      try {

        const response = await fetch(
          'http://localhost:3000/register',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
            }),
          }
        )


        const data = await response.json()


        if (response.ok) {

          setSuccess(true)


          // Registration successful
          // Go to Login page

          setTimeout(() => {

            navigate('/login', {
              replace: true
            })

          }, 1500)

        } else {

          alert(data.message)

        }


      } catch (error) {

        console.log(error)

        alert('Server error')

      }

    }

  }


  return (

    <div className="register-page">

      <div className="register-card">

        {!success ? (

          <>

            <h1>Registration</h1>

            <p className="subtitle">
              Create your account
            </p>


            <form onSubmit={handleSubmit}>

              {/* First Name */}

              <div className="input-group">

                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={event =>
                    setFirstName(event.target.value)
                  }
                  onBlur={validateFirstName}
                />

                {firstNameError && (
                  <p className="error-message">
                    {firstNameError}
                  </p>
                )}

              </div>


              {/* Last Name */}

              <div className="input-group">

                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={event =>
                    setLastName(event.target.value)
                  }
                  onBlur={validateLastName}
                />

                {lastNameError && (
                  <p className="error-message">
                    {lastNameError}
                  </p>
                )}

              </div>


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
                    placeholder="Enter password"
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


              {/* Confirm Password */}

              <div className="input-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="password-input">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={event =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    onBlur={validateConfirmPassword}
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? '🙈'
                      : '👁️'}
                  </button>

                </div>

                {confirmPasswordError && (
                  <p className="error-message">
                    {confirmPasswordError}
                  </p>
                )}

              </div>


              {/* Register Button */}

              <button
                type="submit"
                className="register-button"
              >
                Register
              </button>


              {/* Login */}

              <p>
                Already have an account?{' '}

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                >
                  Login
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
              You are registered successfully
            </h2>

            <p>
              Redirecting to Login...
            </p>

          </div>

        )}

      </div>

    </div>

  )

}

export default RegisterForm

