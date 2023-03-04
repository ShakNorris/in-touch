import React from 'react'

function Authorize() {
  return (
    <div className="login-page">
      <div className="form">
        <div className='app-info'>
          <p>InTouch</p>
        </div>
        <form className="login-form">
          <input name="userName" type="text" placeholder="Username"/>
          <input name="password" type="password" placeholder="Password"/>
          <div className='auth-btns'>
            <button>login</button>
          </div>
          <p className="message">Not registered? <a>Create an account</a></p>
        </form>
        </div>
      </div>
  )
}

export default Authorize