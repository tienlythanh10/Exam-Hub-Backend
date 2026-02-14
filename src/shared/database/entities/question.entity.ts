import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './exam.entity';
import { Topic } from './topic.entity';
import { Stimulus } from './stimulus.entity';
import { QuestionImage } from './question-image.entity';
import { QuestionChoice } from './question-choice.entity';
import { QuestionStatement } from './question-statement.entity';
import { McqCorrectAnswer } from './mcq-correct-answer.entity';
import { FillInBlankCorrectAnswer } from './fib-correct-answer.entity';
import { StatementCorrectAnswer } from './statement-correct-answer.entity';
import { QuestionSolution } from './question-solution.entity';
import { AttemptAnswer } from './attempt-answer.entity';

export enum QuestionType {
  MULTIPLE_CHOICE_QUESTION = 'mcq',
  STATEMENT_QUESTION = 'statement',
  FILL_BLANK_QUESTION = 'fill-blank',
}

export enum CognitiveLevel {
  REMEMBER = 'remember',
  UNDERSTAND = 'understand',
  APPLY = 'apply',
  ANALYZE = 'analyze',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({
    type: 'int',
  })
  position: number;

  @Column({
    type: 'float',
  })
  point: number;

  @Column({
    name: 'cognitive_level',
    type: 'enum',
    enum: CognitiveLevel,
    nullable: true,
    default: null,
  })
  cognitiveLevel?: CognitiveLevel;

  @Column({
    name: 'exam_id',
    type: 'uuid',
  })
  examId: string;

  @Column({
    name: 'topic_id',
    nullable: true,
    default: null,
  })
  topicId?: string;

  @Column({
    name: 'stimulus_id',
    nullable: true,
    default: null,
  })
  stimulusId?: string;

  @ManyToOne(() => Exam, (exam) => exam.questions)
  @JoinColumn({
    name: 'exam_id',
    foreignKeyConstraintName: 'FK_Questions_Exams',
  })
  exam: Exam;

  @ManyToOne(() => Topic, (topic) => topic.questions)
  @JoinColumn({
    name: 'topic_id',
    foreignKeyConstraintName: 'FK_Questions_Topics',
  })
  topic: Topic;

  @ManyToOne(() => Stimulus, (stimulus) => stimulus.questions)
  @JoinColumn({
    name: 'stimulus_id',
    foreignKeyConstraintName: 'FK_Questions_Stimulus',
  })
  stimulus: Stimulus;

  @OneToMany(() => QuestionImage, (questionImage) => questionImage.question)
  images: QuestionImage[];

  @OneToMany(() => QuestionChoice, (questionChoice) => questionChoice.question)
  questionChoices: QuestionChoice[];

  @OneToMany(
    () => QuestionStatement,
    (questionStatement) => questionStatement.question,
  )
  questionStatements: QuestionStatement[];

  @OneToOne(
    () => McqCorrectAnswer,
    (mcqCorrectAnswer) => mcqCorrectAnswer.question,
  )
  mcqAnswer: McqCorrectAnswer;

  @OneToMany(
    () => FillInBlankCorrectAnswer,
    (fibCorrectAnswer) => fibCorrectAnswer.question,
  )
  fibAnswer: FillInBlankCorrectAnswer;

  @OneToMany(
    () => StatementCorrectAnswer,
    (statementCorrectAnswer) => statementCorrectAnswer.question,
  )
  statementAnswers: StatementCorrectAnswer[];

  @OneToMany(
    () => QuestionSolution,
    (questionSolution) => questionSolution.question,
  )
  solutions: QuestionSolution[];

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.question)
  attemptAnswers: AttemptAnswer[];
}
