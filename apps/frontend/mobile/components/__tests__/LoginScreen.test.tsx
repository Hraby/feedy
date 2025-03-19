import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/login';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

// Mockování `useAuth`
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert');
  });

  it('should show an error alert if fields are empty', async () => {
    const loginMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock, loading: false, error: null });

    const { getByTestId } = render(<LoginScreen />);
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    });
  });

  it('should call login function when credentials are provided', async () => {
    const loginMock = jest.fn().mockResolvedValue();
    useAuth.mockReturnValue({ login: loginMock, loading: false, error: null });

    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Heslo'), 'password123');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should show loading indicator when logging in', async () => {
    const loginMock = jest.fn().mockImplementation(() => new Promise(() => {}));
    useAuth.mockReturnValue({ login: loginMock, loading: true, error: null });

    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should show error alert if login fails', async () => {
    useAuth.mockReturnValue({ login: jest.fn(), loading: false, error: 'Invalid credentials' });

    render(<LoginScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });
});
