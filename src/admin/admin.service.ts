import { Injectable } from '@nestjs/common';
/*constructor(private readonly usersService: UsersService ) {}
 [소프트웨어 설계 SOLID ]
  - Injectable 데코레이터를 통해 Singleton 의 Dependency가 생기게 되는데
  *singleton: 객체의 인스턴스가 오직 1개만 생성되는 패턴을 의미
*/
@Injectable()
export class AdminService {
  async getAllMemberList(): Promise<any> {
    try {
      return 'now there are no members!';
    } catch (e) {}
  }
}
