import { InputType, Field } from "type-graphql";

@InputType()
export class AddJobInput {
  @Field()
  jobType: string;

  @Field({ nullable: true })
  schedule?: string;
}
