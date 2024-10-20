import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/use.model';

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
