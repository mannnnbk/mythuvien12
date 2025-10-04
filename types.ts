
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  total: number;
  available: number;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  email: string;
  phone: string;
}

export interface Loan {
  id: string;
  studentId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

export interface Equipment {
  id: string;
  name: string;
  quantity: number;
  status: 'Hoạt động' | 'Bảo trì' | 'Hỏng';
}
