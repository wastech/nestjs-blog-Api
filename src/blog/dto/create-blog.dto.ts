export class CreateBlogDto {
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly imageUrl: string;
  readonly slug: string;
  readonly user: string;
  readonly text: string;
  readonly category: string;
  readonly upvotes: string[];
  readonly downvotes: string[];
}
