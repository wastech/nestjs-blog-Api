import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Body,
  HttpException,
  UseGuards,
  Put,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './entities/auth.entity';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request as ExpressRequest } from 'express';
import { Public } from './decorators/public.decorator';

interface CustomRequest extends Request {
  user?: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.authService.register(createAuthDto);
    return { user };
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.authService.login(loginUserDto);
    console.log('this is token', token);
    if (!token) {
      throw new HttpException(
        'Invalid login credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { token };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() UpdateAuthDto: any) {
    const userId = id;

    return this.authService.updateUser(userId, UpdateAuthDto);
  }
}
