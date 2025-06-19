import { authAPI } from '../../services/api';

// Action Types
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

// Action Creators
export const loginRequest = () => ({
  type: AUTH_LOGIN_REQUEST,
});

export const loginSuccess = (user, token) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: { user, token },
});

export const loginFailure = (error) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: AUTH_LOGOUT,
});

// Thunk Actions
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await authAPI.login(credentials);
    const { user, token } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    dispatch(loginSuccess(user, token));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
    localStorage.removeItem('token');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
}; 