/* eslint-disable prettier/prettier */
import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Member } from "../entites/member.entity";


@ArgsType()
export class MemberProfileInput {
  @Field(type => Number )
  userId: number;
}

@ObjectType()
export class MemberProfileOutput extends CoreOutput {
  @Field(type => Member, { nullable: true } )
  member?: Member; 

}