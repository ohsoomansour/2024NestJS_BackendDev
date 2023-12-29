/* eslint-disable prettier/prettier */

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
 /*
  * #WebRTC 구현: 
     https://acstory.tistory.com/534#google_vignette 참조
   + nestjs chatRoom.service.ts : https://blog.ewq.kr/41 참조

  아래의 3가지 경우 참조: https://velog.io/@fejigu/Socket.IO-client 
  1. socket.io WebSocket과 함께 작동하는 library:  브로드캐스팅을 지원
   [Public ] : "연결된 모든 클라이언트에게 보냄, 채팅 메시지가 적절"
   <서버 측>
  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);  // ✅연결된 모든 클라이언트에게 메시지 통신(브로드 캐스트)
  
    });
  });
  <클라이언트 측> 
  socket.on('chat message', (msg) => {
    console.log(`Received message: ${msg}`);
  });

  [Private] : "특정 고객에게 메시지를 보냄, 예를들어 알림"
   <서버 측>
  io.on('connection', (socket) => {
    socket.on('send notification', (msg, ✅recipientId) => {
      io.to(recipientId).emit('notification', msg);  // ✅지정된 수신자에게 메시지 보내기
  
    });
  });
  <클라이언트 측> 
  socket.on('notification', (msg) => {
    console.log(`Received notification: ${msg}`);
  });
  [Broadcasting] : 발신자를 제외한 모든 클라이언트에게 메세지가 전송되는 경우

  #room이란? "여러 소켓들이 참여(join)하고 떠날 수 있는(leave) 채널"
   - socket이 connect 될 때 기본적으로 해당 소켓 id이름의 room에 기본적으로 들어가있다.
*/
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

@WebSocketGateway(8080, {
  path: '/webrtc',
  cors: '*',
  transports:['websocket']
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('webrtc');
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
    //leave함수는 위와 마찬가지로 socket.leave('room1');과 같이 작성하면 된다.
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
  
  @SubscribeMessage('join')
  handleEmit(@MessageBody() roomId: any, @ConnectedSocket() client: Socket) {
    this.logger.log('we receive a join event');
    /*✔️roodId에 따라 원하는 방을 들어가는 개념 
      >  const roomClients = client.rooms.add(client.id); 
      > "고유 값만 추가 되어 중복되는 소켓은 못 들어감 "
       
    */
      const roomClients = client.rooms; //고유 값만 추가 가능 
      const numberOfClients = roomClients.size; 
      if(numberOfClients === 1) {
        this.logger.log(`Creating room ${roomId} and emitting room_created socket event`);
        client.emit('room_created', roomId);
        client.join(roomId); // Set { <socket.id>, roomId 변수 값 }     
      } else if (numberOfClients === 2){
        this.logger.log(`Joining room ${roomId} and emitting room_joined socket event`);
        client.emit('room_joined', roomId ) //2. roomId를 받으면 -> 클라이언트, start_called 이벤트
      } else { //1명 이상이면 풀이다!
        this.logger.log(`Cant't join room ${roomId}, emitting full_room socket event`)
        client.emit('full_room', roomId);
      }

  } 
  
  /*# 같은 room에 있는 모든 소켓들에 보내는 
    These events are emitted to all the sockets conneted to the same room except the sender.
  */
  @SubscribeMessage('start_call')
  startToCall(@MessageBody() roomId, @ConnectedSocket() client: Socket) {
    this.logger.log(`Broadcasting start_call event to peers in room ${roomId}`);
    //지정된 roomId를 가진 수신자에게만 보냄: roomId 가 어디서? 
    client.broadcast.to(roomId).emit('start_call');  // 112
  }

   //여기까지 안옴
  @SubscribeMessage('webrtc_offer')
  receiveWebrtcOffer(@MessageBody() webrtc_offer, @ConnectedSocket() client: Socket ) {
    console.log(webrtc_offer); 
    this.logger.log(`Broadcasting webrtc_offer event to peers in room ${webrtc_offer.roomId}`)
    client.broadcast.to(webrtc_offer.roomId).emit('webrtc_offer', webrtc_offer.sdp);
  }
}
