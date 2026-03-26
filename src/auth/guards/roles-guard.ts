import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/user/entity/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor( private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ]
        );
        if(!roles){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(!user){
            throw new ForbiddenException('User not found');
        }
        const hasRole = roles.some((role) => user.role === role);
        if(!hasRole){
            throw new ForbiddenException('Access denied');
        }
        return true;
    }
}