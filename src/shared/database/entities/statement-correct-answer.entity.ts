import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Question } from './question.entity';
import { QuestionStatement } from './question-statement.entity';

@Entity('statement_correct_answers')
@Unique('UQ_statement_correct_answers_question_id_statement_id', [
  'questionId',
  'statementId',
])
export class StatementCorrectAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'question_id',
    type: 'uuid',
  })
  questionId: string;

  @Column({
    name: 'statement_id',
    type: 'uuid',
    unique: true,
  })
  statementId: string;

  @Column({
    name: 'correct_answer',
  })
  correctAnswer: boolean;

  @ManyToOne(() => Question, (question) => question.statementAnswers)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_StatementCorrectAnswers_Questions',
  })
  question: Question;

  @OneToOne(() => QuestionStatement)
  @JoinColumn({
    name: 'statement_id',
    foreignKeyConstraintName: 'FK_StatementCorrectAnswers_Statements',
  })
  statement: QuestionStatement;
}
