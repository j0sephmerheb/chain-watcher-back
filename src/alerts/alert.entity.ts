// src/alerts/alert.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coin: string;

  @Column("float")
  percentage: number;

  @Column({
    type: 'enum',
    enum: Direction,
  })
  direction: Direction;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  

  @Column({ default: true })
  active: boolean;
}
