import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';
import axios from 'axios';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async createTest(
    userId: string,
    url: string,
    personaId: string,
    isFigma: boolean = false,
    figmaToken?: string,
  ) {
    const persona = await this.prisma.persona.findUnique({
      where: { id: personaId },
    });
    if (!persona) throw new NotFoundException('Persona non trouvé');

    const test = await this.prisma.test.create({
      data: {
        userId,
        url,
        status: 'PENDING',
        personas: { create: { personaId } },
      },
    });

    let analysis;
    if (isFigma) {
      if (!figmaToken)
        throw new BadRequestException('Token Figma requis pour l’analyse.');
      analysis = await this.analyzeFigmaDesign(url, figmaToken);
    } else {
      analysis = await this.analyzeTest(userId, url, personaId);
    }

    await this.prisma.result.create({
      data: {
        testId: test.id,
        personaId,
        accessibilityScore: analysis.accessibilityScore,
        uxScore: analysis.uxScore,
        aiRecommendations: analysis.recommendations,
      },
    });

    return {
      message: 'Test créé avec succès',
      testId: test.id,
      analysis,
    };
  }

  async getAllTests(userId: string) {
    return this.prisma.test.findMany({
      where: { userId },
      include: { personas: true, results: true },
    });
  }

  async getTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { personas: true, results: true },
    });
    if (!test) throw new NotFoundException('Test non trouvé');
    return test;
  }

  async deleteTest(id: string, userId: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test || test.userId !== userId)
      throw new NotFoundException('Test non trouvé ou accès refusé');

    await this.prisma.test.delete({ where: { id } });
    return { message: 'Test supprimé avec succès' };
  }

  async analyzeTest(userId: string, url: string, personaId: string) {
    const persona = await this.prisma.persona.findUnique({
      where: { id: personaId },
    });
    if (!persona) throw new NotFoundException('Persona non trouvé');

    const constraints =
      typeof persona.constraints === 'string'
        ? JSON.parse(persona.constraints)
        : persona.constraints;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let issues = 0;

      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const backgroundColor = style.backgroundColor;
        const textColor = style.color;

        if (
          backgroundColor === textColor &&
          backgroundColor !== 'transparent'
        ) {
          issues++;
        }
      });

      return issues;
    });

    await browser.close();

    let accessibilityScore = 100 - contrastIssues * 5;
    let uxScore = 90;

    if (constraints.inputMethod === 'keyboard_only') uxScore -= 15;
    if (constraints.vision === 'low') accessibilityScore -= 10;
    if (constraints.screenReader) accessibilityScore -= 5;

    accessibilityScore = Math.max(accessibilityScore, 0);
    uxScore = Math.max(uxScore, 0);

    const recommendations = [];
    if (contrastIssues > 0)
      recommendations.push('Améliorer le contraste des couleurs');
    if (constraints.inputMethod === 'keyboard_only')
      recommendations.push('Optimiser la navigation clavier');
    if (constraints.vision === 'low')
      recommendations.push('Augmenter la taille des polices');
    if (constraints.screenReader)
      recommendations.push(
        'Assurer la compatibilité avec les lecteurs d’écran',
      );

    return {
      accessibilityScore,
      uxScore,
      recommendations,
    };
  }

  async analyzeFigmaDesign(figmaUrl: string, figmaToken: string) {
    const fileId = figmaUrl.split('/file/')[1]?.split('/')[0];
    if (!fileId) throw new BadRequestException('URL Figma invalide.');

    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: { Authorization: `Bearer ${figmaToken}` },
      },
    );

    const nodes = response.data.document.children;
    const accessibilityScore = nodes.length > 10 ? 75 : 90;
    const uxScore = nodes.length > 15 ? 70 : 85;

    return {
      accessibilityScore,
      uxScore,
      recommendations: [
        nodes.length > 10
          ? 'Réduire la complexité des écrans'
          : 'Bonne simplicité',
        'Vérifier la cohérence des couleurs',
      ],
    };
  }
}
