import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PersonasService {
  constructor(private prisma: PrismaService) {}
  async getAllPersonas() {
    return this.prisma.persona.findMany();
  }

  async getPersonaById(id: string) {
    return this.prisma.persona.findUnique({ where: { id } });
  }

  async createPersona(data: {
    name: string;
    description: string;
    constraints: any;
  }) {
    return this.prisma.persona.create({
      data,
    });
  }
  async deletePersona(id: string) {
    const persona = await this.prisma.persona.findUnique({ where: { id } });
    if (!persona) throw new NotFoundException('Persona non trouvé');

    await this.prisma.persona.delete({ where: { id } });
    return { message: 'Persona supprimé avec succès' };
  }
}
