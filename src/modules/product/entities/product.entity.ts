import { Category } from '../../category/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    array: true,
    default: [],
  })
  img_src: string[];

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  city: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  price: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
  })
  category: Category;
}
