import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_choices')
export class QuestionChoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({
    type: 'int',
  })
  position: number;

  @Column({
    name: 'question_id',
    type: 'uuid',
  })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.questionChoices)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_QuestionChoices_Questions',
  })
  question: Question;
}
