import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User ,UserSchema  } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
