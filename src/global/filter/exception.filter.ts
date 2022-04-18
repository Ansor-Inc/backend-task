import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: any) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const responseBody = {
      statusCode: httpStatus,
      message: exception.message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
