import createGoogleOAuthUrl from './createGoogleOAuthUrl';
import login from './login';
import loginWithGoogle from './loginWithGoogle';
import resetPasswordByToken from './resetPasswordByToken';
import resetPasswordWithAuth from './resetPasswordWithAuth';
import sendPasswordResetLink from './sendPasswordResetLink';
import signup from './signup';
import updateEmail from './updateEmail';
import updatePersonalInfo from './updatePersonalInfo';
import updateProfilePhoto from './updateProfilePhoto';

export default [
  createGoogleOAuthUrl,
  login,
  loginWithGoogle,
  resetPasswordWithAuth,
  resetPasswordByToken,
  sendPasswordResetLink,
  signup,
  updateEmail,
  updateProfilePhoto,
  updatePersonalInfo,
];
