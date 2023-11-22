import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateProfileDto } from './dto/create_profile.dto';
import { Profile } from './profile.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        ) { }

    async createUser(user: CreateUserDto) {

        const userFound = await this.userRepository.findOne({
            where: {
                username: user.username
            }
        })

        if (userFound) {
            return new HttpException('User already exists', HttpStatus.CONFLICT)
        }

        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    getUsers() {
        return this.userRepository.find()
    }

    async getUser(id: number) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            },
        });

        if (!userFound) {
            return new HttpException('user not found', HttpStatus.NOT_FOUND);
        }

        return userFound;
    }

    async deleteUser(id: number) {
        const result  = await this.userRepository.delete({id});

        if (result.affected === 0) {
            return new HttpException('User Not Found', HttpStatus.NOT_FOUND)
        }

        return result;

    }

    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        })
        if(!userFound) {
            return new HttpException('User Not Found', HttpStatus.NOT_FOUND)
        }

        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }

    async createProfile(id: number, profile: CreateProfileDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id,
            },
            relations: ['profile'], // Asegúrate de cargar la relación 'profile'
        });
        
        if(!userFound) {
            return new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }

        if (userFound.profile !== undefined && userFound.profile !== null) {
            return new HttpException('Profile already exists', HttpStatus.CONFLICT);
        }

        const newProfile = this.profileRepository.create(profile)
        const savedProfile = await this.profileRepository.save(newProfile)
    
        userFound.profile = savedProfile
        
        return this.userRepository.save(userFound);

    }
}
