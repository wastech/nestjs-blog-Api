import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User ,UserDocument  } from './entities/auth.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<UserDocument>,
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

  async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: User }> {
    const user = await this.authModel.findOne({ email: loginUserDto.email }).exec();
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const payload = { name: user.name, sub: user._id };
    const jwtSecret = 'secret'; // replace with your own secret key
    const token = jwt.sign(payload, jwtSecret);
    return { token, user };
  }

  

  // async register(username: string, password: string): Promise<User> {
  //   const user = await this.user.create({ username, password });
  //   return user;
  // }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
