import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stimulus } from './stimulus.entity';

@Entity('stimulus_images')
export class StimulusImage {
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
    name: 'stimulus_id',
    type: 'uuid',
  })
  stimulusId: string;

  @ManyToOne(() => Stimulus, (stimulus) => stimulus.images)
  @JoinColumn({
    name: 'stimulus_id',
    foreignKeyConstraintName: 'FK_StimulusImages_Stimulus',
  })
  stimulus: Stimulus;
}
