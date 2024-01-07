import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member/entites/member.entity';
import { Admin } from 'typeorm';
import { MemberModule } from './member/member.module';
import { AdminModule } from './admin/admin.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { APP_PIPE } from '@nestjs/core';
import { HomeController } from './home.controller';
//import { AuthModule } from './auth/auth.module';
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
/* #️⃣3.0 TypeORM and PostgreSQL
  1. 🛸TypeScript & NesJS에서 DataBase와 통신하기 위해서 > ⭐ORM 사용
  2. typeorm.io/#/ > TYPE ORM을 쓰면 타입스크립트의 좋은 점을 모두 이용
  3. TypeORM: Object Relational Mapping 객체 관계 매핑 
   > SQL문을 쓰는 대신에 코드를 써서 상호작용을 할 수 있다
   > 타입스크립트 코드 > TYPE ORM <--🛸--> DB와 상호작용 

  4.PostgreSQL setUp: 홈피는 여기 https://www.postgresql.org/ 
  📄 4-1)설치
   > C:\Program Files\PostgreSQL\11 > pw:2848 > port:3000 
   > postgresql-12.12-1-windows-x64.exe --install_runtimes 0
   > 원래는 여기 https://www.postgresql.org/download/ 그러나! 에러 발생 시 아래의 방법으로 다운로드 
   >⭐PostgreSQL 11.2 설치방법 https://source-factory.tistory.com/22
   >⭐PostgreSQL 11.2  https://get.enterprisedb.com/postgresql/postgresql-11.2-1-windows-x64.exe
    ⭐https://www.pgadmin.org/download/에서 pgAdmin 또는 postico(Mac OS)를 설치: "DB의 UI로 쉽게 사용" 
   > 설치경로: C:\Program Files\PostgreSQL\11\data
   > port:5432 (default)

  📄 4-2)서버에 연결 방법 : *2023.12.20 기록  
   > pgAdmin 열기 >  > [Add New server] 또는 상위 Object 탭 > create > server
      - [General 탭] : 
      - ⭐[connection]탭 > hostname: localhost > port:5432 > Maintenanace database: postgres
      - Username: postgres(default)  
      - password: 284823 
   > Database우클릭, Create > Database: 🔹nuber-eats > Owner: ohsoomansour  "여기서 사용자를 변경 할 수있다. "
   > ⭐SQL: Create DATABASE "nuber-eats", OWNER = ohsoomansour  
   > 실행된다는 것만 알고 넘어감
    
    db : test -> NestJS_BackendDev / Owner: postgresql -> ohsoomansour로 변경함  /23.12.20 수정

  5. TypeORM setUp : npm을 참조
   - 의미: TypeScript로 작성된 관계형 매퍼 
   > NestJS 공홈: docs.nestjs.com/techniques/database
   > npm > https://www.npmjs.com/package/typeorm
   > npm install typeorm --save (install the npm package.)
   > ⭐npm install reflect-metadata --save
   > npm install @types/node --save-dev
   > npm install pg --save  (install a database driver)
   > ⭐npm install --save @nestjs/typeorm typeorm pg (*DOCS 기준 이것만 mysql -> pg로 변경해서 설치 필요)
   > npm install typeorm --save
   > Install a database driver: npm install pg --save */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '284823', //postgresql은 비번을 묻지 않음
      database: 'NestJS_BackendDev',
      synchronize: true,
      logging: true,
      entities: [Member, Admin], //[join(__dirname, '/**/*.entity.ts')]
    }),
    MemberModule,
    AdminModule,
    EventsModule,
    ChatModule,
    //AuthModule,
  ],
  controllers: [HomeController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      /*
      useValue: new ValidationPipe({
        disableErrorMessages: true,
      }),*/
    },
  ], //기본적으로 제공되는 ValidationPipe
})
export class AppModule {}
