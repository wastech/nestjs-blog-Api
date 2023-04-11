// export class Blog {}
// //

import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface Blog extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}
