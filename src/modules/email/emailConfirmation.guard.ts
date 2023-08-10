import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestWithUser } from '../auth/interface/auth.interface';

@Injectable()
export default class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: IRequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.isEmailConfirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
