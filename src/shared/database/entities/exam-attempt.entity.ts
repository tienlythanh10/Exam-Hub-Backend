import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './exam.entity';
import { User } from './user.entity';
import { AttemptAnswer } from './attempt-answer.entity';

export enum AttemptStatus {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Entity('exam_attempts')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'started_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startedAt: Date;

  @Column({
    name: 'ended_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  endedAt?: Date;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  score?: number;

  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.IN_PROGRESS,
  })
  status: AttemptStatus;

  @Column({
    name: 'exam_id',
    type: 'uuid',
  })
  examId: string;

  @Column({
    name: 'student_id',
    type: 'uuid',
  })
  studentId: string;

  @ManyToOne(() => Exam, (exam) => exam.attempts)
  @JoinColumn({
    name: 'exam_id',
    foreignKeyConstraintName: 'FK_Attempts_Exams',
  })
  exam: Exam;

  @ManyToOne(() => User, (user) => user.attempts)
  @JoinColumn({
    name: 'student_id',
    foreignKeyConstraintName: 'FK_Attempts_Users',
  })
  student: User;

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.attempt)
  answers: AttemptAnswer[];
}
