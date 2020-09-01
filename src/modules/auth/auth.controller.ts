import {
  Body, Controller, HttpStatus, Post, Res, UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

    @Post('sign-in')
    @UsePipes(ValidationPipe)
  public async login(@Body() body: LoginDto, @Res() res) {
    const token = await this.authService.sign(body);
    res.status(HttpStatus.ACCEPTED).json(`Bearer ${token}`);
  }
}
