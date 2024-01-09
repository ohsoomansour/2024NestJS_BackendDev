/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { MemberRole } from 'src/member/entites/member.entity';
//import { GqlExecutionContext } from '@nestjs/graphql';
/* #CanActivate 인터페이스의 이해
 * @param context Current execution context. Provides access to details about
 *  the current request pipeline.
 * 
 * @returns Value indicating whether or not the current request is allowed to
 *  proceed.
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

  ) {}
  private logger = new Logger('AuthGuard');
  canActivate(context: ExecutionContext){
    //Retrieve metadata for a specified key for a specified target.
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler() //🌟docs: 호출 될 route handler에 대한 참조를 반환 
    );  
    this.logger.log(`['${roles}']`);  // ['admin'] ['undefined']

  //#1.NestJS Context 사용법: req를 받아서 req.member 확인
  const request = context.switchToHttp().getRequest();
  try {
    if(request){
      if(roles.includes(MemberRole.any)){
        return true;
      } 
      if(roles.includes(request.member.memberRole)){
        return true;
      } else {
      }
    } 
  } catch (e) {
    this.logger.error(`memberRole이 'any' 또는 'admin'이 아닙니다.`)
    this.logger.debug(`jwt.middleware.ts파일에서 jwt토큰 안에 해당하는 id의 memberRole를 확인하세요!`);
  }    
    /*#2.Graphql Context 사용법
    const gqlContext = GqlExecutionContext.create(context).getContext();  
    const token = gqlContext.token;

    */
    
  }
}
