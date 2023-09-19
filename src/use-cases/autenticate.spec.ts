
import {expect, describe, it} from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialError } from './errors/invalid-credentials-error';

describe('Authenticate Use Case', () => {
    //deve verificar se o usuário está autenticado
    it('should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: 'John Doe',
            email: 'dgall@gmail.com',
            password_hash: await hash('123456', 6),
        });


        const {user} = await sut.execute({
            email: 'dgall@gmail.com',
            password: '123456',
        });
         
        expect(user.id).toEqual(expect.any(String));

    });

    //não deve ser possível autenticar um email inexistente
    it('should not be able to authenticate a non-existent user', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        expect(async () => {
            await sut.execute({
                email: 'df@example.com',
                password: '123456',
            });
        }).rejects.toBeInstanceOf(InvalidCredentialError);
    });

    //não deve ser possível autenticar com senha incorreta
    it('should not be able to authenticate with incorrect password', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 6),
        });
      
        expect(async () => {
            await sut.execute({
                email: 'john@example.com',
                password: '1234567',
            });
        }).rejects.toBeInstanceOf(InvalidCredentialError);

    });

});

