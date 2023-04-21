import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class CanDeletePostGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const user = request.user;

    // check if the user is authorized to delete the post
    return user && (user.role === Role.Admin || user.posts.includes(postId));
  }
}
