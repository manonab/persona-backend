import { Controller, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les résultats de l’utilisateur' })
  async getAllResults(@Req() req) {
    return this.resultsService.getAllResults(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer les détails d’un résultat' })
  async getResultById(@Param('id') id: string) {
    return this.resultsService.getResultById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un résultat' })
  async deleteResult(@Param('id') id: string, @Req() req) {
    return this.resultsService.deleteResult(id, req.user.userId);
  }
}
