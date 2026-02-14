import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';
import { ExamFile } from './exam-file.entity';
import { Question } from './question.entity';
import { Attempt } from './exam-attempt.entity';

export enum ViewAnswerPolicyType {
  NEVER = 'never',
  ATTEMPT_COMPLETED = 'attempt-completed',
  EXAM_ENDED = 'exam-ended',
}

export enum ExamType {
  PRACTICE = 'practice',
  COMPETITION = 'competition',
}

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'duration_seconds',
    type: 'int',
    nullable: true,
    default: null,
  })
  durationSeconds?: number;

  @Column({
    type: 'enum',
    enum: ExamType,
  })
  type: ExamType;

  @Column({
    name: 'view_answer_policy',
    type: 'enum',
    enum: ViewAnswerPolicyType,
  })
  viewAnswerPolicy: ViewAnswerPolicyType;

  @Column({
    name: 'max_attempts',
    type: 'int',
    nullable: true,
    default: null,
  })
  maxAttempts?: number;

  @Column({
    name: 'start_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  startAt?: Date;

  @Column({
    name: 'end_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  endAt?: Date;

  @Column({
    type: 'enum',
    enum: ExamStatus,
  })
  status: ExamStatus;

  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdById: string;

  @Column({
    name: 'course_id',
    type: 'uuid',
  })
  courseId: string;

  @ManyToOne(() => User, (user) => user.createdExams)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'FK_Exams_Users',
  })
  createdBy: User;

  @ManyToOne(() => Course, (course) => course.exams)
  @JoinColumn({
    name: 'course_id',
    foreignKeyConstraintName: 'FK_Exams_Courses',
  })
  course: Course;

  @OneToMany(() => ExamFile, (examFile) => examFile.exam)
  files: ExamFile[];

  @OneToMany(() => Question, (question) => question.exam)
  questions: Question[];

  @OneToMany(() => Attempt, (attempt) => attempt.exam)
  attempts: Attempt[];
}
