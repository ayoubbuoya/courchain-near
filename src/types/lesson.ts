interface Lesson {
  id: string;
  title: string;
  description?: string;
  video?: string;
  article?: string;
  order: number;
  withAI: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Lesson;
