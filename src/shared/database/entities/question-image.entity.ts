import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_images')
export class QuestionImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column({
    type: 'int',
  })
  position: number;

  @Column({
    name: 'question_id',
    type: 'uuid',
  })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.images)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_QuestionImages_Questions',
  })
  question: Question;
}
