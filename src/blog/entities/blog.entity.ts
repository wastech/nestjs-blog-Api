import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/entities/auth.entity';
import slugify from 'slugify';



export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ default: '' })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  imageUrl: string;

  @Prop()
  text: string;


  @Prop({ type: [String], default: [] })
  upvotes: string[];

  @Prop({ type: [String], default: [] })
  downvotes: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: User;

  @Prop({ default: Date.now })
  createdAt: Date;
}
const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = slugify(this.title, { lower: true });
  next();
});

export { BlogSchema };
