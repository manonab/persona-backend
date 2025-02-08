import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  // Récupérer tous les résultats d'un utilisateur
  async getAllResults(userId: string) {
    return this.prisma.result.findMany({
      where: { test: { userId } },
      include: { persona: true, test: true },
    });
  }

  async getResultById(id: string) {
    const result = await this.prisma.result.findUnique({
      where: { id },
      include: { persona: true, test: true },
    });
    if (!result) throw new NotFoundException('Résultat non trouvé');
    return result;
  }

  async deleteResult(id: string, userId: string) {
    const result = await this.prisma.result.findUnique({
      where: { id },
      include: { test: true },
    });

    if (!result || result.test.userId !== userId) {
      throw new NotFoundException('Résultat non trouvé ou accès refusé');
    }

    await this.prisma.result.delete({ where: { id } });
    return { message: 'Résultat supprimé avec succès' };
  }
}
