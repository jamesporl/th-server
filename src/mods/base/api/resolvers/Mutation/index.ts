import addJob from './addJob.js';
import login from './login.js';
import loginWithGoogle from './loginWithGoogle.js';
import resetPasswordByToken from './resetPasswordByToken.js';
import resetPasswordWithAuth from './resetPasswordWithAuth.js';
import sendPasswordResetLink from './sendPasswordResetLink.js';
import sendVerificationCode from './sendVerificationCode.js';
import signup from './signup.js';
import updateAccountLastSeenAt from './updateAccountLastSeenAt.js';
import updateEmail from './updateEmail.js';
import updatePersonalInfo from './updatePersonalInfo.js';
import updateProfilePhoto from './updateProfilePhoto.js';
import verifyAccountByCode from './verifyAccountByCode.js';

export default [
  addJob,
  login,
  loginWithGoogle,
  resetPasswordWithAuth,
  resetPasswordByToken,
  sendPasswordResetLink,
  sendVerificationCode,
  signup,
  updateAccountLastSeenAt,
  updateEmail,
  updateProfilePhoto,
  updatePersonalInfo,
  verifyAccountByCode,
];
