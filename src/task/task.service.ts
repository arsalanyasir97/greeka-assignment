import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
    priority?: TaskPriority;
    name?: string;
    isActive?: boolean;
  }): Promise<{ data: Task[]; total: number }> {
    const { page = 1, limit = 10, status, priority, name, isActive } = query;
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (name) where.name = Like(`%${name}%`);
    const [data, total] = await this.taskRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, updateData: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateData);
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
} 