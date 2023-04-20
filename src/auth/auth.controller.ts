import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Body,
  HttpException,
  UseGuards,
  Put,
  Req,
  Request,
  Patch,
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
import { RolesGuard } from './roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './entities/auth.entity';

interface CustomRequest extends Request {
  user?: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(): Promise<User[]> {
    return this.authService.findAll();
  }

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

  @Patch('update-password')
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    console.log(req.body);
    const userId = req.user.id;
    // Call the changePassword method on the AuthService
    const result = await this.authService.updateUserPassword(
      userId,
      oldPassword,
      newPassword,
    );

    return result;
  }

  @Delete(':userId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    const deletedUser = await this.authService.deleteUser(
      userId,
      req.user.role,
    );
    return {
      message: `User ${deletedUser.name} has been deleted successfully!`,
    };
  }

  @Get(':id') // Defines a new route with a dynamic parameter "id"
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User) // Allows both admin and regular users to access this route
  async getUser(@Param('id') id: string): Promise<User> {
    return this.authService.getUser(id); // Calls the "getUser" method in the "AuthService" and returns the result
  }
}
