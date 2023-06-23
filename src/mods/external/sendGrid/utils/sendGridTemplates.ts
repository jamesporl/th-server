export enum SendGridTemplateKey {
  verificationCode = 'verificationCode',
  welcomeWithVerificationCode = 'welcomeWithVerificationCode',
  welcomeForGoogleSignup = 'welcomeForGoogleSignup',
  pwResetLink = 'pwResetLink',
  receivedAppSubmission = 'receivedAppSubmission',
  appPublished = 'appPublished',
  adminNewUser = 'adminNewUser',
  adminNewAppSubmission = 'adminNewAppSubmission',
}

export default new Map([
  [SendGridTemplateKey.verificationCode, 'd-8c3003b3c42244c7b2eb094cd0614533'],
  [SendGridTemplateKey.welcomeWithVerificationCode, 'd-0af6a1f898d643cd970992f65d3a8998'],
  [SendGridTemplateKey.welcomeForGoogleSignup, 'd-a6e2b4cbdd5a4569891157b2cfeb27bd'],
  [SendGridTemplateKey.pwResetLink, 'd-82bf868151e34a57b57f29a903902b3b'],
  [SendGridTemplateKey.receivedAppSubmission, 'd-c8d9519611a6402ba4c5be2369885f50'],
  [SendGridTemplateKey.appPublished, 'd-ecf6658ab6654023ac0f8bb86843ed9e'],
  [SendGridTemplateKey.adminNewUser, 'd-41fdc6eeda5c4025acb799c89c1aae17'],
  [SendGridTemplateKey.adminNewAppSubmission, 'd-f244f799ff0b499ca3acb6d526da2936'],
]);
