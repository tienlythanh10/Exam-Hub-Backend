import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './exam.entity';

export enum ExamFileType {
  QUESTION_PAPER = 'question-paper',
  ANSWER_KEY = 'answer-key',
  SOLUTION_SHEET = 'solution-sheet',
}

@Entity('exam_files')
export class ExamFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: ExamFileType,
  })
  type: ExamFileType;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  updatedAt?: Date;

  @Column({
    name: 'exam_id',
    type: 'uuid',
  })
  examId: string;

  @ManyToOne(() => Exam, (exam) => exam.files)
  @JoinColumn({
    name: 'exam_id',
    foreignKeyConstraintName: 'FK_ExamFiles_Exams',
  })
  exam: Exam;
}
