import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AttemptAnswer } from './attempt-answer.entity';

@Entity('fill_in_blank_attempt_answers')
@Unique('UQ_fill_in_blank_attempt_answers_attempt_answer_id_position', [
  'attemptAnswerId',
  'position',
])
export class FibAttemptAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
  })
  position: number;

  @Column()
  answer: string;

  @Column({
    name: 'attempt_answer_id',
    type: 'uuid',
  })
  attemptAnswerId: string;

  @ManyToOne(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.fibAnswers)
  @JoinColumn({
    name: 'attempt_answer_id',
    foreignKeyConstraintName: 'FK_FibAttemptAnswers_AttemptAnswers',
  })
  attemptAnswer: AttemptAnswer;
}
