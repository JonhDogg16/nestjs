import { User } from 'src/users/users.entity'
import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm'


@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    authorId: number;

    @ManyToOne(()=> User, user => user.posts)
    author: User

}