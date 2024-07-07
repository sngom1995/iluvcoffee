import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['name', 'type'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Index()
  name: string;
  @Column()
  type: string;
  @Column('json')
  payload: Record<string, any>;
}
