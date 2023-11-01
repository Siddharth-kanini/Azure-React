import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfileForm from './UserProfileForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onGet('https://localhost:7243/userprofile/GetUserById/1').reply(200, {
  userId: 1,
});

mock.onPut('https://localhost:7243/userprofile/UpdateUserData/1').reply(200);

mock.onPut('https://localhost:7243/userprofile/UpdateUserImage/1').reply(200);

mock.onGet('https://localhost:7243/userprofile/GetUserById/1').reply(200, {
  userId: 1,
  userPassword: 'mockedPassword',
});
describe('UserProfileForm', () => {
    it('renders user profile form correctly', async () => {
      render(<UserProfileForm />);
  
      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
        expect(screen.getByText('Employee ID')).toBeInTheDocument();
      });
    });
  
    it('allows changing user image', async () => {
      render(<UserProfileForm />);
  
      const imageInput = screen.getByLabelText('Change Photo');
      fireEvent.change(imageInput, {
        target: { files: [new File(['mockedImage'], 'user-image.jpg', { type: 'image/jpeg' })] },
      });
  
      await waitFor(() => {
      });
    });
  
    it('submits user data and updates user profile', async () => {
      render(<UserProfileForm />);
  
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
  
      await waitFor(() => {
      });
    });
  
    it('opens the password modal and updates the password', async () => {
      render(<UserProfileForm />);
  
      const updatePasswordButton = screen.getByText('Update Password');
      fireEvent.click(updatePasswordButton);
  
      const updatePasswordModalButton = screen.getByText('Update Password');
      fireEvent.click(updatePasswordModalButton);
  
      await waitFor(() => {
      });
    });
  });
  