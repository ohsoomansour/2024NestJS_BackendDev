import { Body, Controller, Post } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {
    this.memberService = memberService;
  }

  @Post('/join')
  signUpForMembership(@Body() memberInfo) {
    console.log(memberInfo);
    try {
      this.memberService.signUpForMembership(memberInfo);
      return '회원가입을 축하드립니다!';
    } catch {
      console.error();
    }
  }
}
