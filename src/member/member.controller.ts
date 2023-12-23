import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { Request, Response } from 'express';
/* SESSION  COOKIE란? 
  세션의 동작 방식
 > 클라이언트가 서버에 접속 시 세션 ID를 발급 받음
 > 클라이언트는 세션 ID에 대해 '쿠키를 사용해서 저장'하고 가지고 있음
  Set-Cookie : 	connect.sid=s%3AK6CjethYEn9sKy9BRmCHpG6AinvnrdEV.Gmrbjg77FmBlTJ7bc8hZCbHi7cZgd0fTK5x8akXh56U; 
                Path=/; Expires=Sat, 23 Dec 2023 08:51:23 GMT; 
                HttpOnly
 > 클라리언트는 서버에 요청할 때, 이 쿠키의 세션 ID를 같이 서버에 전달해서 요청
 > 서버는 세션 ID를 전달 받아서 별다른 작업없이 세션 ID로 세션에 있는 클라언트 정보를 가져와서 사용
 > 클라이언트 정보를 가지고 서버 요청을 처리하여 클라이언트에게 응답 
  
  */
@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {
    this.memberService = memberService;
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.21
   * @Function : 멤버 등록 함수
   * @Parm : request, response
   * @Return : object
   * @Explain : 클라인트에서 회원가입 POST REQUEST에 대한 처리
   */
  @Post('/join')
  signUpForMembership(@Body() memberInfo) {
    console.log(memberInfo);
    try {
      return this.memberService.signUpForMembership(memberInfo);
    } catch {
      console.error();
    }
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.23
   * @Function : 세션 확인(개발 용도)
   * @Parm : request, response
   * @Return : 없음(세션)
   * @Explain : 로그인 후 세션 만료 기간을 테스트하고 세션 유지 확인
   */
  @Get('/login')
  logIn(@Body() loginInfo, @Req() req: Request, @Res() res: Response) {
    //console.log(loginInfo);
    try {
      //세션 설정
      const session: any = req.session;

      session.user = loginInfo.userId; //사용자가 정의한 임의의 지정 값2
      session.cookie.maxAge = 1000 * 10; //만료 시간 : 10초
      res.status(HttpStatus.OK).send({ session: session });
      //console.log(session); undefined
      this.memberService.login(loginInfo);
      console.log(`${session.user} 회원님이 로그인이 하였습니다.`);
    } catch (e) {
      console.log(e);
    }
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.23
   * @Function : 세션 확인(개발 용도)
   * @Parm : request, response
   * @Return : 없음(Preview 참조)
   * @Explain : 로그인 후 세션 만료 기간을 테스트하고 세션 유지 확인
   */
  @Get('/checkingSession')
  showSession(@Req() req: Request, @Res() res: Response) {
    const session: any = req.session;
    console.log(session);
    res.status(HttpStatus.OK).send({ Session: session });
  }
}
