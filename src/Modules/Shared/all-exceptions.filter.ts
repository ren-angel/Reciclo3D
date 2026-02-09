import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DomainError, EntityNotFoundError, InvalidEntityError, ConflictError, UnauthorizedError, ForbiddenError, InfrastructureError } from '../Shared/custom-errors.exception';

// Global exception filter to handle all exceptions thrown in the application
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  private readonly logger = new Logger(AllExceptionsFilter.name);

  // Method to catch exceptions and format the HTTP response accordingly
  // exception is unknown to allow handling of any type of exception
  // meanwhile host provides methods to access the request and response objects
  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();    // Switch to HTTP context
    const response = ctx.getResponse(); // Get the response object
    const request = ctx.getRequest();   // Get the request object

    // Handle NestJS HttpException separately to extract status and response
    if (exception instanceof HttpException) {

      const status = exception.getStatus();
      const resp = exception.getResponse();

      // Determine the response body based on its type. If it's a string, use it directly; if it's an object, try to extract the message property
      const responseBody =
        typeof resp === 'string'
          ? resp
          : (resp as any).message ?? resp;

      // Format the response for http errors
      return response.status(status).json({
        statusCode: status,
        path: request.url,
        method: request.method,
        message: responseBody,
      });
    }

    // Handle custom DomainErrors and map them to appropriate HTTP status codes
    if (exception instanceof DomainError) {
      
      // Map the domain error to an HTTP status code
      const status = mapDomainErrorToStatus(exception);
      
      // Format the response for domain errors
      return response.status(status).json({
        statusCode: status,
        path: request.url,
        method: request.method,
        message: exception.message,
      });
    }

    // Handle InfrastructureErrors with a 503 Service Unavailable response
    if (exception instanceof InfrastructureError) {

      // Log the infrastructure error. In the previous cases, logging can be done where the error is thrown
      this.logger.error(exception);

      // Format the response for infrastructure errors
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        path: request.url,
        method: request.method,
        message: exception.message,
      });
    }

    // For all other unexpected errors, log it and return a generic 500 Internal Server Error response

    // Log the unexpected error. Check if exception is an Error to access stack, otherwise log the exception as is
    this.logger.error('Unexpected error occurred:', exception instanceof Error ? exception.stack : exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      method: request.method,
      message: 'Erro interno do servidor. Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com o suporte.',
    });
  }
}

// Function to map custom DomainErrors to appropriate HTTP status codes
function mapDomainErrorToStatus(err: DomainError) {

  if (err instanceof EntityNotFoundError) return HttpStatus.NOT_FOUND;
  if (err instanceof InvalidEntityError) return HttpStatus.BAD_REQUEST;
  if (err instanceof ConflictError) return HttpStatus.CONFLICT;
  if (err instanceof UnauthorizedError) return HttpStatus.UNAUTHORIZED;
  if (err instanceof ForbiddenError) return HttpStatus.FORBIDDEN;

  // Default to 400 Bad Request for other DomainErrors
  return HttpStatus.BAD_REQUEST;
}
