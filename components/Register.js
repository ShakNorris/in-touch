import React from 'react'

function Register() {
  return (
    <div className="login-page">
      <div className="form">
        <form className="register-form">
          <div className='app-info'>
            <p>InTouch</p>
          </div>
          <input name="firstName" type="text" placeholder="First Name" />
          <input name="lastName" type="text" placeholder="Last Name" />
          <input name="userName" type="" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" />
          <button>Register</button>
          <p className="message">Already registered? <a>Sign In</a></p>
        </form>
      </div>
  </div>
  )
}

export default Register