import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ResetPasswordWithAuthInput {
  @Field()
  newPassword: string;
}

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;
}

@InputType()
export class LoginWithGoogleInput {
  @Field()
  code: string;

  @Field()
  state: string;
}

@InputType()
export class UpdateEmailInput {
  @Field()
  newEmail: string;
}

@InputType()
export class SendPasswordResetLinkInput {
  @Field()
  email: string;
}

@InputType()
export class ResetPasswordByTokenInput {
  @Field()
  token: string;

  @Field()
  email: string;

  @Field()
  newPassword: string;
}
