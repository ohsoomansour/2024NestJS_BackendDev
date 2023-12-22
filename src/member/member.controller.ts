import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Get('/login')
  logIn(@Body() loginInfo) {
    console.log(loginInfo);
    try {
      this.memberService.login(loginInfo);
      console.log('로그인이 되었습니다.');
    } catch (e) {
      console.log(e);
    }
  }
}
