import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Token } from './token.entity';
import { Subject } from './subject.entity';
import { CourseTeacher } from './course-teacher.entity';
import { Enrollment } from './enrollment.entity';
import { Exam } from './exam.entity';
import { Attempt } from './exam-attempt.entity';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'is_verified',
    nullable: true,
    default: null,
  })
  isVerified?: boolean;

  @Column({
    name: 'verified_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  verifiedAt?: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Subject, (subject) => subject.createdBy)
  createdSubjects: Subject[];

  @OneToMany(() => CourseTeacher, (courseTeacher) => courseTeacher.teacher)
  teachingCourse: CourseTeacher[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrolledCourses: Enrollment[];

  @OneToMany(() => Exam, (exam) => exam.createdBy)
  createdExams: Exam[];

  @OneToMany(() => Attempt, (attempt) => attempt.student)
  attempts: Attempt[];
}
