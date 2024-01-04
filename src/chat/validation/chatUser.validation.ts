/* eslint-disable prettier/prettier */

import { validate } from "class-validator";
import { ChatUserDto } from "../dtos/chat-user.dto";
import { Injectable} from "@nestjs/common";




@Injectable()
export class ChatValidation {
  
  
  async validateUserDto(userDto: ChatUserDto): Promise<void> {
    console.log(userDto);
    const errors = await validate(userDto);
    console.log(errors);
    if (errors.length > 0) {
      const errorMessage = errors.map(error => Object.values(error.constraints).join(', ')).join('; ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
  }
}
