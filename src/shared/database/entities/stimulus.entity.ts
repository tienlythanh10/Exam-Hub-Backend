import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { StimulusImage } from './stimulus-image.entity';

@Entity('stimulus')
export class Stimulus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

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

  @OneToMany(() => Question, (question) => question.stimulus)
  questions: Question[];

  @OneToMany(() => StimulusImage, (stimulusImage) => stimulusImage.stimulus)
  images: StimulusImage[];
}
