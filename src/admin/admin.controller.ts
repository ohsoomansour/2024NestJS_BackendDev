import {
  All,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { MyParamPipe } from './validation/admin-memberParam.pipe';
import { UpdateMemberInfo } from 'src/member/dtos/updateMember.dto';
//import { Role } from 'src/auth/role.decorator';
/* ******************************* 🚨route 주의사항 ********************************* 
  if)요청: http://localhost:3000/admin/search?test 의 경우
  @Get(':id')
  getOne(@Param('id') memberId) {
    return `This will return one member with the id: ${memberId}`;
  }

  @Get('search')
  searchMember() {
    return 'here someone';
  }
  -> 라우트 매핑 에러 인식 과정: NestJS는 id가 search라가 인식한다.
  ->  This will return one member with the id: test  "/search를 타지 않고 /:id를 타버림  "
  -> 해결책: search가 위 :id가 아래로 변경을 하면 정상적으로 
  *********************************************************************************/
@Controller('admin')
export class AdminController {
  //의존성 주입
  constructor(private adminService: AdminService) {
    this.adminService = adminService;
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.24
   * @Function : redirect
   * @Parm :
   * @Return : redirection
   * @Explain : version에 따라 redirect
   */

  @Get('/memberList')
  @Redirect('http://localhost:3000/admin/members')
  redirectToGetMemberList(@Req() req: Request, @Res() res: Response) {
    const session: any = req.session;
    if (session.memberType.memberType != 'admin') {
      return res.redirect('http://localhost:3000/member/login');
    }
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2024.1.5
   * @Function : 멤버 전체를 조회
   * @Parm : (없음)
   * @Return : 회원 전체 리스트
   * @Explain : admin 타입의 관리자가 회원 리스트를 조회
      - admin/memberList의 경로에서만 라우팅 된다. 
   */
  @All('/members')
  //@Role(['Admin'])
  async getMembers(@Req() req: Request, @Res() res: Response) {
    const session: any = req.session;
    const memberRole = session.memberRole.memberRole;
    console.log(memberRole);
    const members = await this.adminService.getAllmembers();

    if (memberRole != 'Admin') {
      res.redirect('http://localhost:3000/member/login');
    } else {
      return res.status(200).send(members);
    }
  }

  /*아이디 또는 이름에 따라 회원을 찾을 수 있게 
    - 설계 순서: 요청 > DB조회 > service, 비즈니스 로직 > 확인된 멤버를 반환  
  */
  /*
   * @Author : OSOOMAN
   * @Date : 2024.1.5
   * @Function :
   * @Parm : '고객의 이름'을 검색 또는 유저의 아이디 검색 예시)osoomansour@naver.com
   * @Return : 사용자 정보 검색 결과
   * @Explain :
   */
  @Get('/members/search')
  searchMember(@Query('name') name: string) {
    // userId로 검색 >
    return this.adminService.searchAmember(name);
  }

  /*
   * @Author : OSOOMAN
   * @Date : 2024.1.5
   * @Function : 회원의 일부 속성을 업데이트
   * @Parm : 파이프 필터 패턴 적용
   * @Return : 회원의 일부 정보가 수정되어 업데이트 된 개인 정보를 반환
   * @Explain : 고객의 요청(전화)에 따라서 주소등 정보 변경
   */
  //@Patch의 의미는 부분 수정을 받을 때 : 고객의 요청에 의한 수정 또는 임의적 확인

  @Patch('/update/:id')
  updateMemeberInfo(
    @Param('id', MyParamPipe) id: number,
    @Body() memberInfo: UpdateMemberInfo,
  ) {
    return this.adminService.editProfile(id, memberInfo);
  }

  /*
   * @Author : OSOOMAN
   * @Date : 2024.1.6
   * @Function : 고객의 계정을 비활성화하는 기능
   * @Parm :
   * @Return :
   * @Explain : 일정시간(1달)을 방문하지 않은 회원들의 계정을 비활성화로 변경
   */
  @Patch('/members/inactive')
  async inactivateAccount() {
    await this.adminService.setUsersToDormant();
  }
}
