import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

export enum EnrollmentMethod {
  INVITATION = 'invitation',
  MANUAL = 'manual',
}

@Entity('enrollments')
@Unique('UQ_enrollments_student_id_course_id', ['studentId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'enrolled_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enrolledAt: Date;

  @Column({
    name: 'enrollment_method',
    type: 'enum',
    enum: EnrollmentMethod,
  })
  enrollmentMethod: EnrollmentMethod;

  @Column({
    name: 'course_id',
    type: 'uuid',
  })
  courseId: string;

  @Column({
    name: 'student_id',
    type: 'uuid',
  })
  studentId: string;

  @ManyToOne(() => Course, (course) => course.students)
  @JoinColumn({
    name: 'course_id',
    foreignKeyConstraintName: 'FK_Enrollments_Courses',
  })
  course: Course;

  @ManyToOne(() => User, (user) => user.enrolledCourses)
  @JoinColumn({
    name: 'student_id',
    foreignKeyConstraintName: 'FK_Enrollments_Users',
  })
  student: User;
}
