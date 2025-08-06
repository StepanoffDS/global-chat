import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // Remove sensitive data from responses
        if (data && typeof data === 'object') {
          this.removeSensitiveData(data);
        }
        return data as unknown;
      }),
    );
  }

  private removeSensitiveData<T extends object>(obj: T): void {
    if (obj && typeof obj === 'object') {
      // Remove password field if present
      if ('password' in obj) {
        delete obj.password;
      }

      // Recursively process nested objects
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          this.removeSensitiveData(obj[key]);
        }
      }
    }
  }
}
