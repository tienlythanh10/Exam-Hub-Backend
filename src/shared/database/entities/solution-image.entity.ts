import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionSolution } from './question-solution.entity';

@Entity('solution_images')
export class SolutionImage {
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
    name: 'solution_id',
    type: 'uuid',
  })
  solutionId: string;

  @ManyToOne(
    () => QuestionSolution,
    (questionSolution) => questionSolution.images,
  )
  @JoinColumn({
    name: 'solution_id',
    foreignKeyConstraintName: 'FK_SolutionImages_QuestionSolution',
  })
  solution: QuestionSolution;
}
