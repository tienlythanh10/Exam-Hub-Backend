import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { SolutionImage } from './solution-image.entity';

@Entity('question_solutions')
export class QuestionSolution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'int',
  })
  position: number;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  updatedAt?: Date;

  @Column({
    name: 'question_id',
    type: 'uuid',
  })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.solutions)
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'FK_QuestionSolutions_Questions',
  })
  question: Question;

  @OneToMany(() => SolutionImage, (solutionImage) => solutionImage.solution)
  images: SolutionImage[];
}
