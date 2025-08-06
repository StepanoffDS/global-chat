import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout user (delete current session)' })
  @ApiResponse({
    status: 204,
    description: 'Successfully logged out',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async logout(@CurrentUser() user: { userId: string }): Promise<void> {
    // Note: In a real implementation, you would need to pass the token
    // This is a simplified version
    return this.sessionsService.deleteAllSessions(user.userId);
  }

  @Delete('all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all sessions for current user' })
  @ApiResponse({
    status: 204,
    description: 'All sessions deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async deleteAllSessions(
    @CurrentUser() user: { userId: string },
  ): Promise<void> {
    return this.sessionsService.deleteAllSessions(user.userId);
  }
}
