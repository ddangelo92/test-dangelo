import { Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { CryptoService } from './crypto.service';

@Module({
  imports: [],
  controllers: [PasswordController],
  providers: [PasswordService, CryptoService],
})
export class AppModule {}
