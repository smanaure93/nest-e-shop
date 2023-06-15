import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text')
  type: string;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text', { array: true })
  tags: string[];

  @Column('text')
  gender: string;

  @BeforeInsert()
  updateSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  updateSlugUpdate() {
    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
