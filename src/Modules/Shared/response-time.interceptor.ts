import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interceptor to measure and log the response time of each request
@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {

    // Intercept method, which takes the execution context (for request/response details) and the next call handler (to proceed with the request), of Observable type (observable stream of data)
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        // Record the start time of the request
        const now = Date.now();

        // Use RxJS's tap operator to perform a side effect (logging) when the response is sent, calculating the time taken and logging it along with the HTTP method and URL
        return next.handle().pipe(
            tap(() => {
                const diff = Date.now() - now;
                const req = context.switchToHttp().getRequest();
                const method = req.method;
                const url = req.url;
                console.log(`${method} ${url} took ${diff}ms`);
            }),
        );
    }
}
