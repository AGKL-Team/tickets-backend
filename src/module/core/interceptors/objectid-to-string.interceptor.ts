import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function transformObjectIds(value: any): any {
  if (value == null) return value;
  if (value instanceof ObjectId) return value.toHexString();
  if (Array.isArray(value)) return value.map((v) => transformObjectIds(v));
  if (typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = transformObjectIds(v);
    }
    return out;
  }
  return value;
}

@Injectable()
export class ObjectIdToStringInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => transformObjectIds(data)));
  }
}
