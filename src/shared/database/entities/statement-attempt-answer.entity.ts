import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AttemptAnswer } from './attempt-answer.entity';
import { QuestionStatement } from './question-statement.entity';

@Entity('statement_attempt_answers')
@Unique('UQ_statement_attempt_answers_attempt_answer_id_statement_id', [
  'attemptAnswerId',
  'statementId',
])
export class StatementAttemptAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'is_correct',
  })
  isCorrect: boolean;

  @Column()
  answer: boolean;

  @Column({
    name: 'attempt_answer_id',
    type: 'uuid',
  })
  attemptAnswerId: string;

  @Column({
    name: 'statement_id',
    type: 'uuid',
  })
  statementId: string;

  @ManyToOne(
    () => AttemptAnswer,
    (attemptAnswer) => attemptAnswer.statementAnswers,
  )
  @JoinColumn({
    name: 'attempt_answer_id',
    foreignKeyConstraintName: 'FK_StatementAttemptAnswers_AttemptAnswers',
  })
  attemptAnswer: AttemptAnswer;

  @ManyToOne(() => QuestionStatement, (statement) => statement.attemptAnswers)
  @JoinColumn({
    name: 'statement_id',
    foreignKeyConstraintName: 'FK_StatementAttemptAnswers_QuestionStatements',
  })
  statement: QuestionStatement;
}
