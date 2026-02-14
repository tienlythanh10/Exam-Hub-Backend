import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('fill_in_blank_correct_answers')
export class FillInBlankCorrectAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'question_id',
    type: 'uuid',
  })
  questionId: string;

  @Column({
    type: 'int',
  })
  position: number;

  @Column({
    name: 'correct_answer',
  })
  correctAnswer: string;

  @ManyToOne(() => Question, (question) => question.fibAnswer)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_FillInBlankCorrectAnswers_Questions',
  })
  question: Question;
}
