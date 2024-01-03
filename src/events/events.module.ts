import { Module } from '@nestjs/common';
import { EventGateway } from './events.gateways';
import { ChatService } from 'src/chat/chat.service';

@Module({
  providers: [EventGateway, ChatService],
})
export class EventsModule {}
