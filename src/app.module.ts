import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PersonasModule } from './personas/personas.module';
import { TestsModule } from './tests/tests.module';
import { ResultsModule } from './results/results.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, PersonasModule, TestsModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
