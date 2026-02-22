import { SetMetadata } from '@nestjs/common';

// Creates a custom decorator that sets metadata to indicate a route is public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);