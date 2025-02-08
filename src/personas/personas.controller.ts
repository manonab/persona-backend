import { Controller, Get, UseGuards, Param, Post, Body, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PersonasService } from './personas.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from "../auth/roles.guard";

@ApiTags('Personas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('personas')
export class PersonasController {
  constructor(private personasService: PersonasService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les personas' })
  getAll() {
    return this.personasService.getAllPersonas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un persona par ID' })
  getOne(@Param('id') id: string) {
    return this.personasService.getPersonaById(id);
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Créer un nouveau persona' })
  @ApiBody({
    schema: {
      example: {
        name: 'Senior',
        description: 'Utilisateur âgé avec des difficultés de vision',
        constraints: { fontSize: 'large', contrast: 'high' },
      },
    },
  })
  create(
    @Body() body: { name: string; description: string; constraints: any },
  ) {
    return this.personasService.createPersona(body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Supprimer un persona (Admin uniquement)' })
  async delete(@Param('id') id: string) {
    return this.personasService.deletePersona(id);
  }
}
