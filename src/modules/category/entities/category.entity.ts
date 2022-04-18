import { Product } from 'src/modules/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Tree('materialized-path')
@Entity({ name: 'category' })
export class Category {
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  title: string;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}
