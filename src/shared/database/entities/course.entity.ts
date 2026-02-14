import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from './subject.entity';
import { CourseTeacher } from './course-teacher.entity';
import { Topic } from './topic.entity';
import { Enrollment } from './enrollment.entity';
import { Exam } from './exam.entity';

export enum CourseType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CourseType,
  })
  type: CourseType;

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
    name: 'subject_id',
    type: 'uuid',
  })
  subjectId: string;

  @ManyToOne(() => Subject, (subject) => subject.relativeCourses)
  @JoinColumn({
    name: 'subject_id',
    foreignKeyConstraintName: 'FK_Courses_Subjects',
  })
  subject: Subject;

  @OneToMany(() => CourseTeacher, (courseTeacher) => courseTeacher.course)
  courseTeachers: CourseTeacher[];

  @OneToMany(() => Topic, (topic) => topic.course)
  topics: Topic[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  students: Enrollment[];

  @OneToMany(() => Exam, (exam) => exam.course)
  exams: Exam[];
}
