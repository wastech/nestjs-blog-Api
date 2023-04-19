import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './entities/auth.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { updatePassword } from './dto/password-update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateAuthDto): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.authModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string; user: User }> {
    const user = await this.authModel
      .findOne({ email: loginUserDto.email })
      .exec();
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    const payload = { name: user.name, sub: user._id };
    // const jwtSecret = 'secret'; // replace with your own secret key
    const token = await this.jwtService.signAsync(payload);
    return { token, user };
  }

  async findById(_id: number): Promise<User> {
    const user = await this.authModel.findById(_id);
    console.log('this is usesrId', user);
    return user;
  }

  async updateUser(userId: string, UpdateAuthDto: any): Promise<User> {
    const filterQuery = { _id: userId };
    const updateQuery = {
      ...UpdateAuthDto,
      // exclude the password field from being updated
      $unset: { password: 1 },
    };
    const options = { new: true };
    const user = await this.authModel.findOneAndUpdate(
      filterQuery,
      updateQuery,
      options,
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

 
}
