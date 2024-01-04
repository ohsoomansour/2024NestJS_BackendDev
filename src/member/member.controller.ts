import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { Request, Response } from 'express';
import { CreateMemberInput } from './dtos/member.dto';
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
   * @Date : 2023.12.24
   * @Function : redirect
   * @Parm : version(변수)
   * @Return : url
   * @Explain : version에 따라 redirect
   */
  @Get('')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
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
  signUpForMembership(@Body() memberInfo: CreateMemberInput) {
    try {
      return this.memberService.signUpForMembership(memberInfo);
    } catch {
      console.error();
    }
  }
  @Get('/login')
  loginPage() {
    return '로그인 페이지입니다.';
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.23
   * @Function : 로그인 후 세션 설정
   * @Parm : request, response
   * @Return : ok가 true이거나 false
   * @Explain : 로그인 후 세션 만료 기간을 테스트하고 세션 유지 확인
   */

  //로그인 버튼을 누르면 홈으로 이동
  @Get('/login/home')
  async logIn(
    //@Body() loginInfo,  # @Body 또는 아래 @Req req 둘 중 하나만 써야된다
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.memberService.login(req.body); // {userId:"Admin4", password:"Adimin4"}
      if (result.ok) {
        //#세션 설정
        const session: any = req.session;
        session.user = req.body.userId; //사용자가 정의한 임의의 지정 값2
        //비즈니스 로직에서 유저 아이디 > memberType를 가져와야 되나
        const memberType = await this.memberService.getMemberType(req.body);
        session.memberType = memberType;
        session.cookie.maxAge = 1000 * 60; //만료 시간 : 60초
        res.status(HttpStatus.OK).send({ session: session });
        console.log(`${session.user} 회원님이 로그인이 하였습니다.`);
      }
      return result;
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
