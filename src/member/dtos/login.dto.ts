/* eslint-disable prettier/prettier */
import { CoreOutput } from "src/common/dtos/output.dto";

export class LoginInput {
  userId: string;
  password: string;
}

export class LoginOutput extends CoreOutput{}