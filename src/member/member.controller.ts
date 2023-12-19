import { Body, Controller, Post } from '@nestjs/common';

@Controller('member')
export class MemberController {
  @Post('/join')
  signUpForMembership(@Body() memberInfo) {
    console.log(memberInfo);
    try {
    } catch {
      console.error();
    }
    return '회원가입을 축하드립니다!';
  }
}
