import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import * as uniqueValidator from 'mongoose-unique-validator';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}

export type UserDocument = User & Document;

export const UserSchema =
  SchemaFactory.createForClass(User).plugin(uniqueValidator);

// export const UserSchema =
//   SchemaFactory.createForClass(User).plugin(uniqueValidator);
