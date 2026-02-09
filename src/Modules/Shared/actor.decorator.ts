import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Actor as ActorType } from './actor.interface';

// Custom decorator to extract the Actor information from the request object, which is populated by the JwtStrategy during JWT validation
// ActorType is an interface that defines the structure of the Actor object, which includes properties such as id, email, and roles
export const Actor = createParamDecorator((data: unknown, ctx: ExecutionContext): ActorType | undefined => {

  const req = ctx.switchToHttp().getRequest(); // Get the HTTP request from the execution context
  return req?.user;                            // If the user property exists on the request, return it as the Actor object; otherwise, return undefined
});