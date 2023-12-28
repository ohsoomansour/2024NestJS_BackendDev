/* eslint-disable prettier/prettier */
/* #WebRTC 구현: 
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

@WebSocketGateway(8081, {
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
    this.logger.log('init'); 
  }


  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`A socket is connectd with the id: ${client.id}`);   
    //console.log(client)
    
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`A socket with id:${client.id} is disconnected From the server.  `)
  } 

  @SubscribeMessage('join')  // socket.io 의 on 메서드 역할
  async handleEvent(@MessageBody() roomId: string, client: Socket ) {
    console.log(roomId);
    /*<input id='room-input' type='text' /> --> 확인: join 할 경우 룸이 생긴다. 
      > "socket이 connect 될 때 기본적으로 해당 소켓 id이름의 room에 기본적으로 들어가있다. "
    */
    

    //#1.room을 만들어야된다. 서버 사이드에서 비즈니스 로직으로 만들어 줄건지 또는 프론트에서 파람을 가져 올 건지
    //#2.room의 clients를 생성해야된다.
    client.data.roomId = roomId;
    client.rooms.clear();
     //socket.join(["room1", "room2"]);
    await client.join(roomId);

    //###WebRTC 구현
    //client.broadcast.to() //socket.io 라이브러리는 브로드캐스팅을 지원
    //this.server.emit('rtc2', data);


  }
  
  @SubscribeMessage('user2')
  handleEmit(@MessageBody() data: any) {
    
    //console.log(data);
    
    return data;
  } 


}