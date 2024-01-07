/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';

@Controller('')
export class HomeController {
  /*
   * @Author : OSOOMAN
   * @Date : 2024.1.7
   * @Function :
   * @Parm :
   * @Return :
   * @Explain :
   */
  @Get('/')
  goHome() {
    return 'Welcom back to Home';
  }
}