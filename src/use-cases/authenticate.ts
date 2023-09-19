import { UsersRepository } from '@/repositories/users.repository';
import { InvalidCredentialError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({email, password}:AuthenticateUseCaseRequest):Promise<AuthenticateUseCaseResponse> {
        // Buscar o usuário pelo email no banco de dados
        // comparar a senha que o usuário digitou com a senha do banco de dados

        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new InvalidCredentialError();
        }

        const doesPasswordMatch = await compare(password, user.password_hash);

        if(!doesPasswordMatch){
            throw new InvalidCredentialError();
        }


        return{
            user,
        };
       
    }
}