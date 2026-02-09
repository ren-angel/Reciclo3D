import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interceptor to standardize API responses by wrapping them in a consistent structure
@Injectable()
export class TransformInterceptor implements NestInterceptor {

    // Intercept method, which takes the execution context (for request/response details) and the next call handler (to proceed with the request), of Observable type (observable stream of data)
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        // Using RxJS's map operator to transform the response data into a standardized format with success and data fields
        return next.handle().pipe(
            map(data => ({ success: true, data }))
        );
    }
}