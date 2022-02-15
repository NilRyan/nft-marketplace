import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import Role from '../enums/role.enum';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const { user } = GqlExecutionContext.create(context).getContext().req;
      return user?.role === role;
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
