import { Injectable } from '@nestjs/common';
import { Profile } from 'src/shared/database/entities/profile.entity';
import { User } from 'src/shared/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProfileRepository {
  private profileRepository: Repository<Profile>;

  constructor(private dataSource: DataSource) {
    this.profileRepository = this.dataSource.getRepository(Profile);
  }

  async createProfile(
    user: User,
    firstName: string,
    lastName: string,
  ): Promise<Profile> {
    const profile = this.profileRepository.create({
      firstName: firstName,
      lastName: lastName,
      userId: user.id,
      user: user,
      createdAt: new Date(),
    });

    return await this.profileRepository.save(profile);
  }

  async findProfileByUserId(userId: string): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: {
        userId: userId,
      },
      relations: {
        user: true,
      },
    });
  }
}
