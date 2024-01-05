/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class UpdateMemberInfo
{
  @IsString()
  address: string;
  @IsString()
  memberType: string;
}