import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { analyzeAccessibility } from '../accessibility-engine';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async createTest(userId: string, url: string, personaId: string) {
    const persona = await this.prisma.persona.findUnique({
      where: { id: personaId },
    });
    if (!persona) throw new NotFoundException('Persona non trouvé');

    const analysis = await analyzeAccessibility(url, persona);

    const test = await this.prisma.test.create({
      data: {
        userId,
        url,
        status: 'PENDING',
        personas: {
          create: {
            persona: {
              connect: { id: personaId },
            },
          },
        },
      },
    });

    const result = await this.prisma.result.create({
      data: {
        test: { connect: { id: test.id } },
        persona: { connect: { id: personaId } },
        uxScore: analysis.uxScore,
        accessibilityScore: analysis.accessibilityScore,
        aiRecommendations: analysis.recommendations,
      },
    });

    return {
      message: 'Test créé avec succès',
      testId: test.id,
      analysis,
      result,
    };
  }

  async getAllTests(userId: string) {
    return this.prisma.test.findMany({
      where: { userId },
      include: {
        personas: { include: { persona: true } },
        results: true,
      },
    });
  }

  async getTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        personas: { include: { persona: true } },
        results: true,
      },
    });
    if (!test) throw new NotFoundException('Test non trouvé');
    return test;
  }

  async deleteTest(id: string, userId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!test) {
      throw new NotFoundException('Test non trouvé');
    }

    if (test.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    await this.prisma.test.delete({
      where: { id },
    });

    return { message: 'Test supprimé avec succès' };
  }
}
