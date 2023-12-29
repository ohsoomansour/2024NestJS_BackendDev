import { NestFactory } from '@nestjs/core';
//import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import * as session from 'express-session'; //세션
import { IoAdapter } from '@nestjs/platform-socket.io';
//import { RedisIoAdapter } from './events/redis.adapter';

/*#git 명령어
 git remote remove origin (기존 원격 저장소 삭제)
 git remote -v (원격 저장소 확인)
 git remote init () "Reinitialized existing Git repository in C:/Users/내컴퓨터/Desktop/Nest_JS/Dev_Backend/.git/"
 git status (로컬 저장소 올리기 전 staging area의 목록 )
 git add 파일이름 vs git add .
 만약) warning: in the working copy of '.eslintrc.js', LF will be replaced by CRLF the next time Git touches it 에러의 경우
 > git config --global core.autocrlf true
 git commit -m "12.18 First Commit" (로컬 저장소에 커밋)
 git remote add origin https://github.com/ohsoomansour/chatting_frontend.git
 - "원격이 없는 경우 새로운 깃 리파지토리를 만들어서 내 로컬저장소에 원격을 지정하는데,
    이 원격(목적 url)의 이름은 origin으로 한다."

 git branch [이름] master(분기해서 나올 브랜치)
 git branch (브랜치가 main 또는 master에 위치하고 있는 지 확인: *master 초록색이 현재 브랜치를 가리키고 있음)
 git push origin master (origin 원격 저장소 이름을 가지고 있는 master 브랜치에 업데이트 하겠다. )
 
 Promise: ES6에서 비동기 처리를 위한 패턴으로 '프로미스'를 도입
 - 장점: 비동기 처리 시점을 명확하게 표현 할 수 있음
 - 인스턴스화 방법: 생성자 함수를 통해 인스턴스화 
   const promise = new Promise((resolve, reject) => {
    if(//"비동기 작업 수행 성공"){
      resolve('result')
    } else { // "비동기 작업 수행 실패"
      reject('failure reason')
    }
   })

  


 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule); //반환: NestApplication instance
  //const redisIoAdapter = new RedisIoAdapter(app);
  //await redisIoAdapter.connectToRedis();
  //app.useWebSocketAdapter(redisIoAdapter); //redis 소켓
  app.useWebSocketAdapter(new IoAdapter(app)); // socket
  //app.useWebSocketAdapter(new WsAdapter(app));  //웹소켓
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(
    session({
      secret: 'SESSION_ID_SM', //세션아이디
      resave: false, //request 중에 세션이 수정되지 않아도 세션을 세션 저장소에 다시 저장하도록 강제
      saveUninitialized: false, //초기화되지 않는 세션을 저장하게 함
    }),
  ); //localhost == 127.0.0.1

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
