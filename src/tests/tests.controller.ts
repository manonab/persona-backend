import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tests')
export class TestsController {
  constructor(private testsService: TestsService) {}

  @Post()
  @ApiOperation({ summary: 'Lancer un test sur un site web' })
  @ApiBody({
    schema: {
      example: {
        url: 'https://example.com',
        personaId: 'persona-uuid',
      },
    },
  })
  async createTest(
    @Req() req: RequestWithUser,
    @Body()
    body: {
      url: string;
      personaId: string;
    },
  ) {
    const userId = req.user.userId;
    return this.testsService.createTest(
      userId,
      body.url,
      body.personaId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les tests de l’utilisateur' })
  async getAllTests(@Req() req: RequestWithUser) {
    return this.testsService.getAllTests(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un test par ID' })
  async getTestById(@Param('id') id: string) {
    return this.testsService.getTestById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un test par ID' })
  async deleteTest(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.testsService.deleteTest(id, req.user.userId);
  }
}
