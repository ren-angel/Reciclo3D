import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// Interceptor to enforce a timeout on requests, throwing a RequestTimeoutException if the request takes longer than the specified time
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {

    // Default timeout duration in milliseconds (15 seconds)
    constructor(private readonly ms = 15000) {}

    // Intercept method, which takes the execution context (for request/response details) and the next call handler (to proceed with the request), of Observable type (observable stream of data)
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        // Use RxJS's timeout operator to enforce the timeout, and catchError to handle timeout errors by throwing a RequestTimeoutException
        return next.handle().pipe(
            timeout(this.ms),
            catchError((err) =>
                err instanceof TimeoutError
                ? throwError(() => new RequestTimeoutException())
                : throwError(() => err),
            ),
        );
    }
}
