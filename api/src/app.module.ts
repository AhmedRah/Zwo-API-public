import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { AnimalBreedsModule } from './modules/animal-breeds/animal-breeds.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AnimalsModule,
    PostsModule,
    AnimalBreedsModule,
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
