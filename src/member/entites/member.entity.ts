/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entites/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm'; 
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
//import { Field, registerEnumType } from '@nestjs/graphql';

/**/
export enum MemberRole {
  admin = "admin",
  manager = "manager",
  client = "client",
  any = "any"
}
//#설치 필요: npm i @nestjs/graphql
registerEnumType(MemberRole, { name: 'MemberRole'});

@Entity()
export class Member extends CoreEntity {
  
  @Column()
  userId: string;
  
  @Column({nullable: true})
  password: string;

  @Column({nullable : true})
  name: string;

  @Column()
  address: string;
  /*🚨컬럼 생성 시 문제 발생: 
    query failed: ALTER TABLE "member" ADD "memberType" character varying NOT NULL
    error: error: "memberType" 열에는 null 값 자료가 있습니다 
    > member 테이블에 컬럼을 추가하는데 값이 없으니까 바로 에러가 발생한다
    > 해결점: 일단 nullable을 허용 > 컬럼 추가 > 값 추가 > null 적용 여부를 생각하면 된다!
  */
  //@Column({nullable : true, type: 'enum', enum: MemberRole}) @Column({nullable : true })
  @Column({nullable : true, type: 'enum', enum: MemberRole}) 
  memberRole: MemberRole;

  @Column({nullable: true})
  lastActivityAt: Date;

  @Column({nullable: true})
  isDormant: boolean;

  /*#패스워드 일치 문제 정리
    1. this.password에는 마지막에 로그인 한 id의 password가 남아있다.
      - osoomansour8@naver.com이 마지막 로그인 하면 여기에 맞는 osoomansour7의 해시된 함수가 남아있다!
    2. 
     로그인 입력 패스워드:osoomansour7
     로그인 시 DB 패스워드: null
     [문제 추정1]
     
     */
  @BeforeInsert()
  //@BeforeUpdate()
  async hashingPw(): Promise<void> {
    
    if(this.password){
      try {
        //entity에 삽입 또는 업데이트 전에 암호화 saltOrRounds이 높을 수록 암호화🔺 속도 🔻   
        this.password = await bcrypt.hash(this.password, 10)
        console.log(`해싱 후 패스워드:${this.password}`)
      } catch (e) {
        console.log(e)
        throw new InternalServerErrorException()
      }
    }
  }

  async checkingPw(reqPassword : string) : Promise<boolean> {
    try {
      console.log(`로그인 입력 패스워드:${reqPassword}`);
      console.log(`로그인 시 DB 패스워드:${this.password}`)
      const ok = await bcrypt.compare(reqPassword, this.password);
      return ok;
    } catch(e) {

      throw new InternalServerErrorException('The password is wrong!');
    }
  } 



}
