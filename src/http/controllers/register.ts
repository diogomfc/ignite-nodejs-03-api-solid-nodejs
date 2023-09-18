import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { registerUseCase } from '@/use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply){

    const registreBodySchema =  z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const {name, email, password} = registreBodySchema.parse(request.body);

    try{
        await registerUseCase({
            name,
            email,
            password,
        });
    } catch(err){
        return reply.status(409).send();
    }
      
    
    return reply.status(201).send();
}