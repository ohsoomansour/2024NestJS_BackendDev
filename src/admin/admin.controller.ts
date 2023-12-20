import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
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

  @Get('/list')
  memberAllList() {
    return this.adminService.getAllMemberList();
  }
  /*아이디 또는 이름에 따라 회원을 찾을 수 있게 
    - 설계 순서: 요청 > DB조회 > service, 비즈니스 로직 > 확인된 멤버를 반환  
  */
  @Get('search')
  searchMember(@Query('name') memberName) {
    return `here member name ${memberName}`;
  }
  //@Patch의 의미는 부분 수정을 받을 때 : 고객의 요청에 의한 수정 또는 임의적 확인
  @Patch('/update/:id')
  updateMemeberInfo(@Param('id') memberId: number, @Body() memberInfo) {
    return {
      memberId: memberId,
      ...memberInfo,
    };
  }
}
