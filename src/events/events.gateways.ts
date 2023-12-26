/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

//import { Server, Socket } from 'socket.io';

/* NestJS에서 웹 소켓 서버에 설정 
1. 설치 및 설정 
 [ Gateways ]
 npm i --save @nestjs/websockets @nestjs/platform-socket.io (*nestjs 공식 문서)
 [ Adapters ]
 npm i -s @nestjs/websockets @nestjs/platform-ws
 
2. [main.ts ]에서 'adapter' 추가 필요
 async function bootstrap() {
  const app = await NestFactory.create(AppModule); 
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
}
bootstrap();

 ########################## 웹소켓 설정 문제 ###############
 샘플 git 참조: https://github.com/nestjs/nest/tree/master/sample/16-gateways-ws/src/events
 1.해결 방법: npm i ws or npm install @types/ws
 [package.json 파일]
   "dependencies": {
    "@nestjs/common": "10.2.10",
    "@nestjs/core": "10.2.10",
    "@nestjs/platform-express": "10.2.10", 
    "@nestjs/platform-ws": "10.2.10", ✅
    "@nestjs/websockets": "10.2.10", ✅
    "class-transformer": "0.5.1",
    "class-validator": "0.14.0",
    "rimraf": "5.0.5",
    "reflect-metadata": "0.1.13",
    "rxjs": "7.8.1",
    "ws": "8.13.0" ✅
  }, 
 
 Q. 웹소켓 각 namespace 어떻게 사용할 것인가 ?
 A. ws library does not support namespaces (communication channels popularised by socket.io).
   However, to somehow mimic this feature, you can mount multiple ws servers on different paths
    (example: @WebSocketGateway({ path: '/users' })).

 🚫지원하지 않는 아래의 예시
  @WebSocketGateway(8080, {
  namespace: 'chat',
  cors: { origin: '*' },
  })
 
 ✅ 현재 기준은 @WebSocketGateway(8080, {path: '/chat'}) 이렇게 써야된다. 
   

 # @SubscribeMessage(키값) 사용법 
   1. 'events' 정의한 키값이 존재한 메시지가 도착하면
      [클라이언트 예시]
      wsProp.current?.send(JSON.stringify({
      "event": "events",
      "data": "12.26 14:03 First Message will arrive at Dev_BackEnd server"
      }))

      [서버]
      @SubscribeMessage('events')
      event키 값은 events라고 인식하고 @MessageBody() data를 수신 
      
*/
@WebSocketGateway(8080, {path: '/chat', cors: '*'})
export class EventGateway 
{
  constructor() {}

  @WebSocketServer() server: Server
  private logger: Logger = new Logger('EventsGateway');
  
  @SubscribeMessage('user1')
  handleEvent(@MessageBody() data: any) {
    console.log(data);
    this.server.emit('event1', { name: 'Im Nest' });
    const returnData = {subscribing: "I receive your message"}
    return returnData
    //return returnData;
  }

  @SubscribeMessage('user2')
  handleEmit(@MessageBody() data: any) {
    console.log(data);

    return data;
  } 


}
