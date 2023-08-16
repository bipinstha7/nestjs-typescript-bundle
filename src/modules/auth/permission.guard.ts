import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import AuthGuard from './middleware/auth.guard';
import IPermission from './interface/permission.interface';
import { IRequestWithUser } from './interface/auth.interface';

const PermissionGuard = (permission: IPermission): Type<CanActivate> => {
  class PermissionGuardMixin extends AuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<IRequestWithUser>();
      const user = request.user;

      return user?.permissions.includes(permission);
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
