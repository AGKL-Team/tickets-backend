import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../../../database/services/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly firebaseClient: FirebaseFirestore.Firestore | undefined;

  constructor(private readonly firebaseService: FirebaseService) {
    this.firebaseClient = this.firebaseService.getClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const [, token] = authHeader.split(' ');

    if (!token) throw new UnauthorizedException('No token provided');

    // Verify token using Firebase adapter and return a Supabase-like result
    const { user } = await this.firebaseService.getUserFromToken(
      token as string,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = user; // user record from Firebase
    return true;
  }
}
