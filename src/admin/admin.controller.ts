import { Body, Controller, Param, Patch } from '@nestjs/common';

//@Patch의 의미는 부분 수정을 받을 때
@Controller('admin')
export class AdminController {
  @Patch('/update/:id')
  updateMemeberInfo(@Param('id') memberId: number, @Body() memberInfo) {
    return {
      memberId: memberId,
      ...memberInfo,
    };
  }
}
