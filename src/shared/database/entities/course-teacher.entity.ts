import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('course_teachers')
@Unique('UQ_course_teachers_teacher_id_course_id', ['teacherId', 'courseId'])
export class CourseTeacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'teacher_id',
    type: 'uuid',
  })
  teacherId: string;

  @Column({
    name: 'course_id',
    type: 'uuid',
  })
  courseId: string;

  @Column({
    name: 'joined_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt: Date;

  @Column({
    name: 'is_owner',
  })
  isOwner: boolean;

  @ManyToOne(() => User, (user) => user.teachingCourse)
  @JoinColumn({
    name: 'teacher_id',
    foreignKeyConstraintName: 'FK_CourseTeachers_Users',
  })
  teacher: User;

  @ManyToOne(() => Course, (course) => course.courseTeachers)
  @JoinColumn({
    name: 'course_id',
    foreignKeyConstraintName: 'FK_CourseTeachers_Courses',
  })
  course: Course;
}
