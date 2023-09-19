
import { RegisterUseCase } from '@/use-cases/register';
//import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import {expect, describe, it, beforeEach} from 'vitest';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';


let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;


describe('Register Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    }); 


    //deve ser hash assim que ele se cadastrar na aplicação.
    it('should hash user password upon registration', async () => {
        const {user} = await sut.execute({
            name: 'John Doe',
            email: 'dgall@gmail.com',
            password: '123456',
        });
         
        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

        await expect(isPasswordCorrectlyHashed).toBe(true);

    });
    //Não deve ser possível cadastrar o email mais de duas vezes
    it('should not register an already registered email', async () => {
        const email = 'dev@prisma.com';

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
        });

        await expect(async () => {
            await sut.execute({
                name: 'John Doe',
                email,
                password: '123456',
            });
        }).rejects.toBeInstanceOf(UserAlreadyExistsError);

    });

    //Deve cadastrar um usuário
    it('should register a user', async () => {
        const {user} = await sut.execute({
            name: 'John Doe',
            email: 'john@example',
            password: '123456',
        });

        await expect(user.id).toEqual(expect.any(String));
    });

});

