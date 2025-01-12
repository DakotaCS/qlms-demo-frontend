/**
 * @author Dakota Soares
 * @version 1.1
 * @description Login Page
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import logo from '../../assets/logo.png';
import apiClient from '../../config/axiosConfig';
import AuthContext from '../../config/authContext';
import { useScanning } from '../../config/scanningContext';
import './loginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { enableScanning } = useScanning();

    /**
   * When called, do the following:
   * 1. Retrieve the user details
   * 2. Set the token in local storage
   * 3. Retrieve the current user details
   * 4. Set the user ID and user name
   * 5. Enable the auth context
   * 6. Enable scanning
   * 7. Navigate to the Login Page
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResponse = await apiClient.post('/login', { username, password });
      const { jwt } = loginResponse.data;
      localStorage.setItem('token', jwt);

      const userDetailsResponse = await apiClient.get('/system/user/current-user');
      
      const { id, userName } = userDetailsResponse.data;
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', userName);

      setIsAuthenticated(true);
      enableScanning();
      navigate('/landing');
    } catch (err) {
      setError('Error: The username or password is invalid');
    }
  };

  return (
    <>
    <Header></Header>
      <div className="login-container">
        <img src={logo} alt="Logo" />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
      <Footer></Footer>
    </>
  );
};

export default LoginPage;
