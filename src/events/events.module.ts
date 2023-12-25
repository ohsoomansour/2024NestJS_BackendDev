import { Module } from '@nestjs/common';
import { EventGateway } from './events.gateways';

@Module({
  providers: [EventGateway],
})
export class EventsModule {}
