import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import RegistrationScreen from '../../app/register';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('RegistrationScreen', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      register: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it('should show loading indicator when registering', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      register: jest.fn(),
      loading: true,
      error: null,
    });

    const { getByTestId } = render(<RegistrationScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
