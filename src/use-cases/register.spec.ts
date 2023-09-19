import { RegisterUseCase } from '@/use-cases/register';
//import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import {expect, test, describe, it} from 'vitest';
import { compare } from 'bcryptjs';

describe('Register Use Case', () => {
    //deve ser hash assim que ele se cadastrar na aplicação.
    it('should hash user password upon registration', async () => {
        //const prismaUsersRepository = new PrismaUsersRepository();
        const registerUseCase = new RegisterUseCase({
            async findByEmail(email) {
                return null;
            },
            async create(data) {
                return {
                    id: 'any_id',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date(),
                };
            },
        });

        const {user} = await registerUseCase.execute({
            name: 'John Doe',
            email: 'dgall@gmail.com',
            password: '123456',
        });
         
        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

        expect(isPasswordCorrectlyHashed).toBe(true);

    });
});

