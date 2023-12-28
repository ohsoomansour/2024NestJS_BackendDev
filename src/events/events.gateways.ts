/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import {
  
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server} from 'ws';
//import { Server, WebSocket } from 'ws'; VS import { Server, Socket } from 'socket.io';
/* #1.NestJS에서 웹 소켓 서버에 설정 
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
 /*
 #2Lifecycle hooks 활용
 #3채팅 서버 설계 ( 여기에 시간 투자 )
 1. redis활용을 통한  https://velog.io/@1yongs_/Redis-Clustering-NestJS-Chat-App
    - https://github.com/dlfdyd96/nestjs-redis-socketio
    - 설명: 서버2개, 각 서버에서 채팅을 하는 것을 구현 따라서 웹소켓의 정의를 제대로 구현
   Redis를 쓰는 이유? 
    "Key, value 구조의 비정형 데이터를 저장하고 관리하기 위한 오픈 소스 기반의 비관계형 DBMS"
    >  1개의 서버 이상을 사용 할 때 유용 
    >  메모리 기반 데이터 구조의 빠른 응답성을 확보함과 동시에 데이터 불일치 문제를 해결
    > ⭐캐시 서버로 이용할 수 있는 것이 바로 Redis 
       캐시서버란? "데이터를 가까운 곳에 데이터를 임시 저장" (java, HashMap 원리)
   [redis DB 설치 및 설정] 
    > 레디스의 GUI 툴: set d test  "key가 d, value가 test의 값을 생성"
   

   [redis와 typeORM과 캐싱 설정]
   방법1. TypeOrm 
   TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '284823', //postgresql은 비번을 묻지 않음
      database: 'NestJS_BackendDev',
      synchronize: true,
      logging: true,
      entities: [Member, Admin],
      cache: {
          type: "redis",
          options: {
              host: "localhost",
              port: 6379
          }
      }
    }),
    
    
    방법2. CacheModule 사용
    *참고: https://show400035.tistory.com/188#google_vignette
    > import { Module, CacheModule } from '@nestjs/common';
    > 
    > class-validator 설치: npm i --save class-validator class-transformer
    > 컨틀로러 > 서비스 > redis
     constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
     const value = await this.cacheManager.get(key);
      

   
 
 
  */ 
@WebSocketGateway(8080, {
  path: '/chat',
  cors: '*',
  transports:['websocket']
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  constructor() {
    this.logger.log('constructor');
  }

  @WebSocketServer() server: Server
  
  afterInit() {
    this.logger.log('init'); //gateway가 실행될 때 가장 먼저 실행
  }

  //TypeError: Cannot read properties of undefined (reading 'name')
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`A socket is connectd with the id: ${client.id}`);    //undefined
    //console.log(client)
    
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`A socket with id:${client.id} is disconnected From the server.  `)
  } 

  @SubscribeMessage('user1')  // socket.io 의 on 메서드 역할
  handleEvent(@MessageBody() data: any) {
    
    //###WebRTC 구현 , @ConnectedSocket() client:Socket
    //client.broadcast.to() //event.roomId
    
    this.server.emit('user1', data);
    console.log(data);
    //this.server.emit('event1', { name: 'Im Nest' });
    //로직: 유저 채팅 아이디를 캐시 서비스 로직> redis에서 꺼내온다!
    
    const returnData = {subscribing: "I receive your message"}
    return returnData
    //return returnData;
  }
  
  @SubscribeMessage('user2')
  handleEmit(@MessageBody() data: any) {
    
    //console.log(data);
    
    return data;
  } 


}
