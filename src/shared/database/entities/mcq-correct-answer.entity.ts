import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('mcq_correct_answers')
export class McqCorrectAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'question_id',
    type: 'uuid',
    unique: true,
  })
  questionId: string;

  @Column({
    name: 'correct_answer',
    type: 'uuid',
  })
  correctAnswer: string;

  @OneToOne(() => Question, (question) => question.mcqAnswer)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_McqCorrectAnswers_Questions',
  })
  question: Question;
}
