import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entites/member.entity';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
//import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [TypeOrmModule.forFeature([Member]), MemberService],
})
export class MemberModule {
  static forRoot: any;
}
