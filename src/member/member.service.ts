import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entites/member.entity';
import { CreateMemberInput, CreateMemberOutput } from './dtos/member.dto';
/* priavate only members: Repository<member> "member엔티티를 타입"
  1.Repository 만들어서 생성자 함수에 주입 시켜줘야됨
  2. const newMember = members.create(CreateMemberInput) 
     > 비즈니스 로직을 통해 Creates a new newMember entity instance
     > await this.members.save(newMember)
     > 성공하면 return "멤버가 만들어 짐"
     > 실패하면 return "멤버 생성 실패" 
  +------------------------------------------------ TypeORM --------------------------------------------+
  | 1.create 메서드: Creates a new entity instance and                                                   |            
  |    copies all entity properties from this object into a new entity.                                 |
  |    Note that it copies only properties that are present in entity schema.                           | 
  |  이해: this object는 this.members를 가리키는 것으로 추정, 모든 엔티티 프로퍼티를 새 인티티로 복사를 한다. |       
  |       entity properties는 entity 스키마의 즉, DB의 테이블 컬럼들과 일치한다.                           |
  +
*/
@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly members: Repository<Member>,
  ) {}

  async signUpForMembership(
    createMemberInput: CreateMemberInput,
  ): Promise<CreateMemberOutput> {
    try {
      const newMember = this.members.create(createMemberInput);
      await this.members.save(newMember);
      return {
        ok: true,
        error: 'Welcom to our word!',
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'You coud not sign up for Membership',
      };
    }
  }
}
