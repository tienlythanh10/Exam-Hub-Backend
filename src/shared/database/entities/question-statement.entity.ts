import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { StatementAttemptAnswer } from './statement-attempt-answer.entity';

@Entity('question_statements')
export class QuestionStatement {
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

  @ManyToOne(() => Question, (question) => question.questionStatements)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_QuestionStatements_Questions',
  })
  question: Question;

  @OneToMany(
    () => StatementAttemptAnswer,
    (statementAttemptAnswer) => statementAttemptAnswer.statement,
  )
  attemptAnswers: StatementAttemptAnswer[];
}
