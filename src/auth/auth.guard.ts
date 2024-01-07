/* eslint-disable prettier/prettier */
//import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
//import { Reflector } from '@nestjs/core';
//import { AllowedRoles } from './role.decorator';
/* #CanActivate 인터페이스의 이해
 * @param context Current execution context. Provides access to details about
 *  the current request pipeline.
 * 
 * @returns Value indicating whether or not the current request is allowed to
 *  proceed.
 */
/*
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext){
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler() //🌟docs: 호출 될 route handler에 대한 참조를 반환 
    );  
  if(!roles) {
    return true
  }
  }
}
*/