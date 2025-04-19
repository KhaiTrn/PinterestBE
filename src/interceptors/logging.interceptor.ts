import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RES_SUCCESS } from 'src/decorators/response-success.decorator';

// hàm đóng gói ResponseSuccess để trả về đúng format
export const ResponseSuccess = (
  metadata = null,
  message = 'ok',
  code = 200,
) => {
  if (typeof code !== `number`) code = 200;
  return {
    status: 'success',
    code: code,
    message: message,
    metadata: metadata,
    doc: `api.domain.com/doc`,
  };
};
@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  constructor(public reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    const code = res.statusCode;
    const mes = this.reflector.getAllAndOverride<string>(RES_SUCCESS, [
      context.getHandler(),
      context.getClass(),
    ]);
    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return ResponseSuccess(data, mes, code);
      }),
    );
  }
}
