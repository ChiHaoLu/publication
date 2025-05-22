export interface Article {
  id: string;
  title: string;
  content: string;
  markdown: string;
  date: string;
  tags: string[];
  isPinned: boolean;
} 