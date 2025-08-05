import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export enum TaskStatus {
  PENDING = 'Pending',
  DONE = 'Done',
  IN_PROGRESS = 'In Progress',
  PAUSED = 'Paused',
}

export enum TaskPriority {
  RED = 'Red', // High
  YELLOW = 'Yellow', // Medium
  BLUE = 'Blue', // Normal
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'date' })
  @IsDateString()
  dueDate: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.BLUE })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
} 