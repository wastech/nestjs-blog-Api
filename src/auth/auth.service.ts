import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './entities/auth.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Role } from './entities/auth.entity';

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
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateAuthDto,
  ): Promise<User> {
    const allowedUpdates = ['name', 'email']; // fields that can be updated
    const updates = Object.keys(updateUserDto); // fields sent in the request body
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update),
    ); // check if all fields are allowed to be updated

    if (!isValidUpdate) {
      throw new BadRequestException('Invalid updates!');
    }

    const user = await this.authModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    updates.forEach((update) => {
      user[update] = updateUserDto[update];
    });

    await user.save();

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.authModel.find().exec();
  }

  async updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.authModel.findById(userId);

    if (!user) {
      // throw new Error(`User with id ${userId} not found`);
      // User does not exist
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    // Check if the current user is authorized to update the password
    // Check if the old password matches the user's current password
    const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);

    if (!oldPasswordMatches) {
      // Old password does not match
      throw new UnauthorizedException('Invalid old password');
    }
    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password cannot be the same as old password',
      );
    }

    // Hash the new password using bcrypt and update it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.authModel.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true },
    );

    return updatedUser;
  }

  async deleteUser(userId: string, userRole: Role): Promise<User> {
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is authorized to delete
    if (userRole !== Role.Admin && user._id.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this user',
      );
    }

    return this.authModel.findByIdAndRemove(userId);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.authModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
