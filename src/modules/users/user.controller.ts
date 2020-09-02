import {
  Controller, Get, Param, Req, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { JwtAuthGuard } from '../../shared';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @Get('')
  @UsePipes(ValidationPipe)
  async getMany() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return req.user;
  }

  @Get(':id')
  async getOne(@Param() { id }): Promise<UserDto> {
    return this.service.findOne(id);
  }
}
