import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/entites/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [AdminController],
  providers: [AdminService, MemberService],
})
export class AdminModule {}
