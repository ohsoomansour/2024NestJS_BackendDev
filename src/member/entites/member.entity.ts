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