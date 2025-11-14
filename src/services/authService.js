import axios from 'axios';

const login = async (identifier, password, userType) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      identifier,
      password,
      userType
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);

    return user;
  } catch (error) {
    console.error('Error de login:', error.response?.data || error.message);
    throw error;
  }
};

export default login;
