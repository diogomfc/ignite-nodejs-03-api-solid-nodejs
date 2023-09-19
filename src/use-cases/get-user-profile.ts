import { UsersRepository } from '@/repositories/users.repository';

import { User } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase{
    constructor(private usersRepository: UsersRepository) {}

    async execute({userId}:GetUserProfileUseCaseRequest):Promise<GetUserProfileUseCaseResponse> {
        // Buscar o usuário pelo email no banco de dados
        // comparar a senha que o usuário digitou com a senha do banco de dados

        const user = await this.usersRepository.findById(userId);

        if(!user){
            throw new ResourceNotFoundError();
        }

        return{
            user,
        };
     
    }
}