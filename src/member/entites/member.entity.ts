/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entites/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from '@nestjs/common';
@Entity()
export class Member extends CoreEntity {
  
  @Column()
  userId: string;
  
  @Column()
  password: string;

  @Column()
  address: string;
  /*🚨컬럼 생성 시 문제 발생: 
    query failed: ALTER TABLE "member" ADD "memberType" character varying NOT NULL
    error: error: "memberType" 열에는 null 값 자료가 있습니다 
    > member 테이블에 컬럼을 추가하는데 값이 없으니까 바로 에러가 발생한다
    > 해결점: 일단 nullable을 허용 > 컬럼 추가 > 값 추가 > null 적용 여부를 생각하면 된다!
  */
  @Column({nullable : true})
  memberType: string;
  
  @BeforeInsert()
  @BeforeUpdate()
  async hashingPw(): Promise<void> {
    if(this.password){
      try {
        //entity에 삽입 또는 업데이트 전에 암호화 saltOrRounds이 높을 수록 암호화🔺 속도 🔻   
        this.password = await bcrypt.hash(this.password, 10)
      } catch (e) {
        console.log(e)
        throw new InternalServerErrorException()
      }
    }
  }

  async checkingPw(reqPassword : string) : Promise<boolean> {
    try {
      const confirm = await bcrypt.compare(reqPassword, this.password);
      return confirm;
    } catch(e) {
      throw new InternalServerErrorException();
    }
  } 



}