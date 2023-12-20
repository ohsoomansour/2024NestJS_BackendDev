/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';
@Entity()
export class Member extends CoreEntity {
  
  @Column()
  userId: string;
}