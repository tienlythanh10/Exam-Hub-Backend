import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('subjects')
export class Subject {
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
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  updatedAt?: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdById: string;

  @ManyToOne(() => User, (user) => user.createdSubjects)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'FK_Subjects_Users',
  })
  createdBy: User;

  @OneToMany(() => Course, (course) => course.subject)
  relativeCourses: Course[];
}
