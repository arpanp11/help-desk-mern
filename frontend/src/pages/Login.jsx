import { useState } from 'react';

import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

import { login } from '../features/auth/authSlice';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const changeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };
  return (
    <>
      <section className='heading'>
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please login to get support</p>
      </section>

      {/* login form */}
      <section className='form'>
        <form onSubmit={submitHandler}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              onChange={changeHandler}
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              onChange={changeHandler}
              placeholder='Enter password'
              required
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-block'>Login</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
