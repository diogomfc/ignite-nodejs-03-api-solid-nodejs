
import { RegisterUseCase } from '@/use-cases/register';
//import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import {expect, describe, it} from 'vitest';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
    //deve ser hash assim que ele se cadastrar na aplicação.
    it('should hash user password upon registration', async () => {
        //const prismaUsersRepository = new PrismaUsersRepository();
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const {user} = await registerUseCase.execute({
            name: 'John Doe',
            email: 'dgall@gmail.com',
            password: '123456',
        });
         
        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

        expect(isPasswordCorrectlyHashed).toBe(true);

    });
    //Não deve ser possível cadastrar o email mais de duas vezes
    it('should not register an already registered email', async () => {
        //const prismaUsersRepository = new PrismaUsersRepository();
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const email = 'dev@prisma.com';

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        });

        expect(async () => {
            await registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456',
            });
        }).rejects.toBeInstanceOf(UserAlreadyExistsError);

    });

    //Deve cadastrar um usuário
    it('should register a user', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const {user} = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john@example',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

});

