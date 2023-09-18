import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {hash} from 'bcryptjs';

export async function register(request: FastifyRequest, reply: FastifyReply){

    const registreBodySchema =  z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const {name, email, password} = registreBodySchema.parse(request.body);

    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if(userWithSameEmail){
        return reply.status(400).send({
            error: 'User with this email already exists'
        });
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
        }
    });

    return reply.status(201).send();

}