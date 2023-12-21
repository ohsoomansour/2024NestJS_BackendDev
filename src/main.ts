import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
/*git 명령어
 git remote remove origin (기존 원격 저장소 삭제)
 git remote -v (원격 저장소 확인)
 git remote init () "Reinitialized existing Git repository in C:/Users/내컴퓨터/Desktop/Nest_JS/Dev_Backend/.git/"
 git status (로컬 저장소 올리기 전 staging area의 목록 )
 git add 파일이름 vs git add .
 만약) warning: in the working copy of '.eslintrc.js', LF will be replaced by CRLF the next time Git touches it 에러의 경우
 > git config --global core.autocrlf true
 git commit -m "12.18 First Commit" (로컬 저장소에 커밋)
 git branch origin (원격 저장소의 이름)
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
  await app.listen(3000, 'localhost', () => {
    console.log('app listening on port 3000');
  });
}
bootstrap();
