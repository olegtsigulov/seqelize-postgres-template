import {
  Body, Controller, Get, HttpStatus, Post, Put, Query, Req, Res, UseGuards, UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { LoginDto } from './dto/login.dto';
import { OAuthGuard } from '../../shared/guards/auth/oauth.guard';
import { Provider } from '../../shared/decorators/auth-provider.decorator';
import { UserDto } from '../users/dto';
import { ProvidersEnum } from './enum/providers.enum';
import { JwtRefreshGuard } from '../../shared/guards/auth/jwt-refresh.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../shared';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {SetNewPasswordDto} from "./dto/set-new-password.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** --------------------LOCAL SIGN UP ----------------------------- */
  @Post('local/sign-up')
  @Provider(ProvidersEnum.LOCAL)
  @ApiBody({
    type: CreateLocalUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Local user created.',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description:
        'Forbidden to authorize. You have been banned by administrator.',
  })
  @UsePipes(ValidationPipe)
  public async localSignUp(@Body() body: CreateLocalUserDto, @Res() res) {
    const user = await this.authService.localSignUp(body, res);
    res.status(HttpStatus.CREATED).json(user);
  }

  /** --------------------LOCAL SIGN IN ----------------------------- */
    @Post('local/sign-in')
    @Provider(ProvidersEnum.LOCAL)
    @ApiBody({
      schema: { example: { email: 'user@gmail.com', password: '123456' } },
    })
    @ApiResponse({
      status: 200,
      description: 'Local user authorized.',
      type: UserDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
      status: 403,
      description:
          'Forbidden to authorize. You have been banned by administrator.',
    })
    @UsePipes(ValidationPipe)
  public async localLogin(@Body() body: LoginDto, @Res() res) {
    const user = await this.authService.localLogin(body, res);
    res.status(HttpStatus.OK).json(user);
  }

  /** --------------------LOCAL CHANGE PASSWORD ----------------------------- */
  @Post('local/change-password')
  @Provider(ProvidersEnum.LOCAL)
  @ApiBody({
    schema: { example: { email: 'user@gmail.com', oldPassword: '123456', newPassword: '123' } },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden to change password. You have been banned by administrator.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
    public async changePassword(@Body() body: ChangePasswordDto, @Res() res) {
      const result = await this.authService.changePassword(body, res);
      res.status(HttpStatus.OK).json({ result });
    }

  /** ----------------FORGOT PASSWORD--------------------------------*/
  @Get('forgot-password')
  @ApiOperation({
    summary: 'Send confirmation to email for restore user password',
    description: 'Restore user password by email, '
        + 'restore only active roles users, send confirmation to email',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmation sent',
    schema: { example: { result: true } },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @UsePipes(ValidationPipe)
  public async forgotPassword(@Query() query: ForgotPasswordDto, @Res() res) {
    const result = await this.authService.forgotPassword(query.email);
    res.status(HttpStatus.OK).json({ result });
  }

  @Put('forgot-password')
  @ApiOperation({
    summary: 'Restore user password',
    description: 'Save new user password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @UsePipes(ValidationPipe)
  public async setNewPassword(@Body() body: SetNewPasswordDto, @Res() res) {
    const result = await this.authService.saveNewPassword(body, res);
    res.status(HttpStatus.OK).json({ result });
  }
  /** --------------------GOOGLE SIGN ------------------------------- */
  @Post('google/sign-in')
  @Provider(ProvidersEnum.GOOGLE)
  @ApiBody({
    schema: { example: { access_token: 'google_account_access_token' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description:
        'Forbidden to authorize. You have been banned by administrator.',
  })
  @ApiResponse({
    status: 201,
    description: 'Google user created.',
    type: UserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Google user authorized.',
    type: UserDto,
  })
  @UseGuards(OAuthGuard)
  async googleSignIn(@Req() req, @Res() res) {
    const { user, newUser } = await this.authService.socialSign(req.userInfo, res);
    res.status(newUser ? HttpStatus.CREATED : HttpStatus.OK).json(user);
  }

  /** --------------------FACEBOOK SIGN ------------------------------- */
  @Post('facebook/sign-in')
  @Provider(ProvidersEnum.FACEBOOK)
  @ApiBody({
    schema: { example: { access_token: 'facebook_account_access_token' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description:
        'Forbidden to authorize. You have been banned by administrator.',
  })
  @ApiResponse({
    status: 201,
    description: 'Facebook user created.',
    type: UserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Facebook user authorized.',
    type: UserDto,
  })
  @UseGuards(OAuthGuard)
  @UsePipes(ValidationPipe)
  async facebookSignIn(@Req() req, @Res() res) {
    const { user, newUser } = await this.authService.socialSign(req.userInfo, res);
    res.status(newUser ? HttpStatus.CREATED : HttpStatus.OK).json(user);
  }

  /** --------------------REFRESH TOKEN ----------------------------- */
  @Post('refresh-token')
  @ApiHeader({
    name: 'refresh_token',
    description: 'user refresh token',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Facebook user created.',
    schema: { example: { result: true } },
  })
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Req() req, @Res() res) {
    await this.authService.tokenSign(req.userInfo, res);
    res.status(HttpStatus.OK).json({ result: true });
  }
}
