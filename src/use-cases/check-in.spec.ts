
import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository ';

import { CheckInUseCase } from './check-in';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;


describe('Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        gymsRepository.items.push({
            id: 'user-gym-id',
            title: 'user-gym-name',
            description: 'user-gym-description',
            phone: 'user-gym-phone',
            latitude: new Decimal(0),
            longitude:  new Decimal(0),
        });

        vi.useFakeTimers();
    }); 

    afterEach(() => {
        vi.useRealTimers();
    });


    it('should be able to check in', async () => {

        const {checkIn} = await sut.execute({
            gymId: 'user-gym-id',
            userId: 'user-id',
            userLatitude: -23.50376303910327,
            userLongitude: -46.87863120336247,
        });

        await expect(checkIn.id).toEqual(expect.any(String));

    });

    it('should be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
        
        await sut.execute({
            gymId: 'user-gym-id',
            userId: 'user-id',
            userLatitude: -23.50376303910327,
            userLongitude: -46.87863120336247,
        });

        await expect(() => 
            sut.execute({
                gymId: 'user-gym-id',
                userId: 'user-id',
                userLatitude: -23.50376303910327,
                userLongitude: -46.87863120336247,
            }),
        ).rejects.toBeInstanceOf(Error);
    });
 
});

