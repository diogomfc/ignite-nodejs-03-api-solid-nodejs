
import {expect, describe, it, beforeEach} from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';

import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });


    //deve verificar se o usuário tem um perfil
    it('should be able to get user profile', async () => {

        const createUser = await usersRepository.create({
            name: 'John Doe',
            email: 'dgall@gmail.com',
            password_hash: await hash('123456', 6),
        });


        const {user} = await sut.execute({
            userId: createUser.id,
        });
         
        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual('John Doe');

    });

    //não deve ser possível autenticar um id invalido
    it('should be able to get user profile with wrong id', async () => {

        expect(async () => {
            await sut.execute({
                userId: 'non-existent-id',
            });
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

});

