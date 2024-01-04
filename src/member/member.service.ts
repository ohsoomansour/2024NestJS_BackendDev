import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entites/member.entity';
import { CreateMemberInput, CreateMemberOutput } from './dtos/member.dto';
import { LoginInput, LoginOutput, MemberType } from './dtos/login.dto';
/* priavate only members: Repository<member> "member엔티티를 타입"
  1.Repository 만들어서 생성자 함수에 주입 시켜줘야됨
  2. const newMember = members.create(CreateMemberInput) 
     > 비즈니스 로직을 통해 Creates a new newMember entity instance
     > await this.members.save(newMember)
     > 성공하면 return "멤버가 만들어 짐"
     > 실패하면 return "멤버 생성 실패" 
  +------------------------------------------------ TypeORM --------------------------------------------+
  | 1.create 메서드: Creates a new entity instance and                                                   |            
  |    copies all entity properties from this object into a new entity.                                  |
  |    Note that it copies only properties that are present in entity schema.                            | 
  |  이해: this object는 this.members를 가리키는 것으로 추정, 모든 엔티티 프로퍼티를 새 인티티로 복사를 한다.  |       
  |       entity properties는 entity 스키마의 즉, DB의 테이블 컬럼들과 일치한다.                            |
  +-----------------------------------------------------------------------------------------------------+

  3. 패스워드 어떻게 할 지
    
    #Hashing Passwords
    3-1)What is an Entity Listener? 📄https://typeorm.io/listeners-and-subscribers
      - Any of your entities can have methods with custom logic that listen to specific entity events.
    
    3-2)@BeforeInsert: You can define a method with any name in entity and mark it with @BeforeInsert 
    and TypeORM will call it before the entity is inserted using repository/manager save.
    (※Entity 안의 내용 참고)

    3-3) bcrypt 📄https://www.npmjs.com/package/bcrypt 
      > 설치: npm i bcrypt > npm i @types/bcrypt --dev-only
      > 임포트: import * as bcrypt from "bcrypt"; 
      > 에러 해결 : stack overflow 참조
      npm install node-gyp -g
      npm install bcrypt -g
      npm install bcrypt --save

    - 개념: hash하고 & hash확인에 활용
    - npm > To hash a password: (중요부분)
      🔹saltOrRound: salt를 몇 번 돌릴거냐는 뜻. default: 10, 놆을 수록 암호화가 강력해지지만 속도는 느려짐
    - [users.service.ts]에서 await this.users.save(this.users.create({email, password, role}))
      > this.users.create({email, password, role}) (인스턴스를 이미 가지고 있음) 
      > await bcrypt.hash(this.password, 10);
      🔹InternalServerErrorException(): service파일 내부에서 catch한다
        >의미해석: (DB 저장하기 전에 서버에서 에러 발생 ) > 🚨{ok:false, error: "Couldn't create account" }
  
  5.jwt 또는 
  
  6.session확인 : https://lts0606.tistory.com/623 참고
    npm i express-session
    npm i -D @types/express-session
    @All 데코레이터 의미: 
*/

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly members: Repository<Member>,
  ) {}
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.21
   * @Function : 회원가입
   * @Parm : CreateMemberInput (DTO)
   * @Return : object
   * @Explain : 고객이 아이디, 비밀번호, 주소를 입력하여 회원가입을 신청
   */
  async signUpForMembership({
    userId,
    password,
    address,
    memberType,
  }: CreateMemberInput): Promise<CreateMemberOutput> {
    try {
      //이 아이디가 존재 하는 지 검사 필요
      const idExist = await this.members.findOne({ where: { userId } });
      if (idExist) {
        return { ok: false, error: 'ID already exists' };
      }
      const newMember = this.members.create({
        userId,
        password,
        address,
        memberType,
      });
      await this.members.save(newMember);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'You coud not sign up for Membership',
      };
    }
  }
  /*
   * @Author : OSOOMAN
   * @Date : 2023.12.23
   * @Function : 회원 로그인
   * @Parm : LoginInput(DTO)
   * @Return : ok:true 또는 false와 error를 담은 object
   * @Explain : 세션을 가지고 로그인을 한다.
   * @개선 필요🔺: 불필요한 세션을 줄이기 위한 방법은 ?
   */
  async login({ userId, password }: LoginInput): Promise<LoginOutput> {
    try {
      const member = await this.members.findOne({
        where: { userId },
      });
      if (!member) {
        return {
          ok: false,
          error: 'Member do not exist',
        };
      }
      const confirmPw = await member.checkingPw(password);
      //console.log(confirmPw); //undefined >> "true 외 전부"
      if (!confirmPw) {
        return {
          ok: false,
          error: 'The password is wrong',
        };
      }
      return {
        ok: true,
        error: '',
      };
    } catch (e) {
      console.error(e);
    }
  }
  //주의: 리턴 타입 Promise<memberType>에서 memberType(DTO)로 하면 계속 Promise { <pending> }
  async getMemberType({ userId }: LoginInput): Promise<MemberType> {
    try {
      const member = await this.members.findOne({
        where: { userId },
      });
      //console.log(member);
      if (member) {
        return {
          memberType: member.memberType,
        };
      } else {
        return {
          memberType: '멤버 타입을 알 수 없습니다',
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getAllmembers(): Promise<Member[]> {
    try {
      const members = await this.members.find({
        order: {
          id: 'DESC',
        },
      });
      return members;
    } catch (e) {
      console.error(e);
    }
  }
}
