import addJob from './addJob';
import createGoogleOAuthUrl from './createGoogleOAuthUrl';
import login from './login';
import loginWithGoogle from './loginWithGoogle';
import resetPasswordByToken from './resetPasswordByToken';
import resetPasswordWithAuth from './resetPasswordWithAuth';
import sendPasswordResetLink from './sendPasswordResetLink';
import sendVerificationCode from './sendVerificationCode';
import signup from './signup';
import updateEmail from './updateEmail';
import updatePersonalInfo from './updatePersonalInfo';
import updateProfilePhoto from './updateProfilePhoto';
import verifyAccountByCode from './verifyAccountByCode';

export default [
  addJob,
  createGoogleOAuthUrl,
  login,
  loginWithGoogle,
  resetPasswordWithAuth,
  resetPasswordByToken,
  sendPasswordResetLink,
  sendVerificationCode,
  signup,
  updateEmail,
  updateProfilePhoto,
  updatePersonalInfo,
  verifyAccountByCode,
];
