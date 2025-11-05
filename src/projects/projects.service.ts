import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project, Tag } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.ProjectCreateInput & { tags?: string[] },
  ): Promise<Project & { tags: Tag[] }> {
    const tagConnect =
      data.tags?.map((name) => ({ where: { name }, create: { name } })) ?? [];
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        image: data.image ?? null,
        imageBig: data.imageBig ?? null,
        github: data.github ?? null,
        linkOnDeploy: data.linkOnDeploy ?? null,
        link: data.link ?? null,
        filter: data.filter,
        tags: {
          connectOrCreate: tagConnect,
        },
      },
      include: { tags: true },
    });
    return project;
  }

  async findAll(): Promise<(Project & { tags: Tag[] })[]> {
    return this.prisma.project.findMany({ include: { tags: true } });
  }

  async findOne(id: number): Promise<Project & { tags: Tag[] }> {
    const p = await this.prisma.project.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }

  async update(
    id: number,
    data: Partial<Prisma.ProjectUpdateInput> & { tags?: string[] },
  ): Promise<Project & { tags: Tag[] }> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        title: data.title as string | undefined,
        image: (data.image as string | null | undefined) ?? undefined,
        imageBig: (data.imageBig as string | null | undefined) ?? undefined,
        github: (data.github as string | null | undefined) ?? undefined,
        linkOnDeploy:
          (data.linkOnDeploy as string | null | undefined) ?? undefined,
        link: (data.link as string | null | undefined) ?? undefined,
        filter: data.filter as string | undefined,
        ...(data.tags
          ? {
              tags: {
                set: [],
                connectOrCreate: data.tags.map((name) => ({
                  where: { name },
                  create: { name },
                })),
              },
            }
          : {}),
      },
      include: { tags: true },
    });
    return project;
  }

  async remove(id: number): Promise<{ success: true }> {
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
