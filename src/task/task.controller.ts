import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: Task })
  @ApiResponse({ status: 201, description: 'Task created', type: Task })
  create(@Body() createTaskDto: Partial<Task>) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('name') name?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.taskService.findAll({ page, limit, status, priority, name, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Task found', type: Task })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Task })
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: Partial<Task>) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }
} 