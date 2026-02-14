import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Question } from './question.entity';
import { Attempt } from './exam-attempt.entity';
import { FibAttemptAnswer } from './fib-attempt-answer.entity';
import { StatementAttemptAnswer } from './statement-attempt-answer.entity';

@Entity('attempt_answers')
@Unique('UQ_attempt_answers_question_id_attempt_id', [
  'questionId',
  'attemptId',
])
export class AttemptAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'is_fully_correct',
    nullable: true,
    default: null,
  })
  isFullyCorrect?: boolean;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  score?: number;

  @Column({
    name: 'time_spent_seconds',
    type: 'int',
  })
  timeSpentSeconds: number;

  @Column({
    name: 'question_id',
    type: 'uuid',
  })
  questionId: string;

  @Column({
    name: 'attempt_id',
    type: 'uuid',
  })
  attemptId: string;

  @ManyToOne(() => Question, (question) => question.attemptAnswers)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_AttemptAnswers_Questions',
  })
  question: Question;

  @ManyToOne(() => Attempt, (attempt) => attempt.answers)
  @JoinColumn({
    name: 'attempt_id',
    foreignKeyConstraintName: 'FK_AttemptAnswers_Attempts',
  })
  attempt: Attempt;

  @OneToMany(
    () => FibAttemptAnswer,
    (fibAttemptAnswer) => fibAttemptAnswer.attemptAnswer,
  )
  fibAnswers: FibAttemptAnswer[];

  @OneToMany(
    () => StatementAttemptAnswer,
    (statementAttemptAnswer) => statementAttemptAnswer.attemptAnswer,
  )
  statementAnswers: StatementAttemptAnswer[];
}
