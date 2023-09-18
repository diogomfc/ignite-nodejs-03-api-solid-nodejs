import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply){

    const registreBodySchema =  z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(6).max(255),
    });

    const {name, email, password} = registreBodySchema.parse(request.body);
     
    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password
        }
    });

    return reply.status(201).send();

}