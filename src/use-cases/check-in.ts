import { GymsRepository } from './../repositories/gyms-repository';

import { CheckInsRepository } from '@/repositories/check-ins-repository';

import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase{
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}

    async execute({userId, gymId}:CheckInUseCaseRequest):Promise<CheckInUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        // calculate distance between user and gym
        // if distance is greater than 100 meters, throw error
        // if distance is less than 100 meters, create check-in
        
        
        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDay){
            throw new ResourceNotFoundError();
        }
      
        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return {
            checkIn,
        };
    }
}