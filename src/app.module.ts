import { Module } from '@nestjs/common';
import { MemberController } from './member/member.controller';
import { AdminController } from './admin/admin.controller';
/*
  Controllers and Providers are scoped by the module
  > 컨트롤러 및 공급자의 범위는 모듈에 따라 결정됩니다.
  @Moddule: "클래스 위의 함수이고 클래스를 위해 움직인다고 생각"
  1. main, service, module, controller만 남아있다.  
  2. 커맨드 - npm run start:dev "Nest application successfully started">  localhost:3000  
  3. 아래의 bootstrap 함수 해석
    3.1) booststrap 함수는 기본적으로 async로 선언되어 만들어진다 
    3.2) 🔹AppModule이라는 인수를 받아서 Nest 어플리케이션 🔹인스턴스를 생성
      - Object.create메서드를 호출하여 '새로운 객체'를 만들 수 있음  
      - app의 prototype는 AppModule이고 
    3.3)Node.js ※https://iamdaeyun.tistory.com/entry/Nodejs%EB%A1%9C-%EA%B0%84%EB%8B%A8%ED%95%9C-%EC%9B%B9-%EC%84%9C%EB%B2%84-%EB%A7%8C%EB%93%A4%EA%B8%B0
        > listen(port, [hostname], [backlog] [callback])
         예시) const http = require('http') "http 모듈을 불러옴"
               const server = http.createServer(); "웹 서버 객체를 만들고"
               const port = 3000
               const host = '192.168.05'
               server.listen(port, host, '50000', () => {
                console.log('Running : %d', host, post )
               })  
        > listen메서드를 사용하여 '3000번 포트'를 사용하여 웹서비스를 구동 
        > 성공적으로 구동하면 listen메서드가 Promise를 반환하기 때문에 await를 사용한 것  
        > 
    4. 모듈은 '앱'처럼 쓸 수 있다. 예를들어 instagram에서 photo 모듈, video 모듈 
*/
@Module({
  imports: [],
  controllers: [MemberController, AdminController],
  providers: [],
})
export class AppModule {}
