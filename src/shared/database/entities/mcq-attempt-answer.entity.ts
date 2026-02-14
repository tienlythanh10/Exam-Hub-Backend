import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttemptAnswer } from './attempt-answer.entity';

@Entity('mcq_attempt_answer')
export class McqAttemptAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  answer: string;

  @Column({
    name: 'attempt_answer_id',
    type: 'uuid',
  })
  attemptAnswerId: string;

  @OneToOne(() => AttemptAnswer)
  @JoinColumn({
    name: 'attempt_answer_id',
    foreignKeyConstraintName: 'FK_McqAttemptAnswers_AttemptAnswers',
  })
  attemptAnswer: AttemptAnswer;
}
