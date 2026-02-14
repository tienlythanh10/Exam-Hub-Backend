import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Question } from './question.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'course_id',
    type: 'uuid',
  })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.topics)
  @JoinColumn({
    name: 'course_id',
    foreignKeyConstraintName: 'FK_Topics_Courses',
  })
  course: Course;

  @OneToMany(() => Question, (question) => question.topic)
  questions: Question[];
}
