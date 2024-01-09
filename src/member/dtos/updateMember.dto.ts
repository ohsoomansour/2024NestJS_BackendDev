/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";
import { MemberRole } from "../entites/member.entity";

//import { MemberRole } from "../entites/member.entity";

export class UpdateMemberInfo
{
  @IsString()
  address: string;
  @IsString()
  memberRole: MemberRole;
}