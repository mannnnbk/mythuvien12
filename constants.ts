
import { Book, Student, Loan, Equipment } from './types';

export const MOCK_BOOKS: Book[] = [
  { id: 'B001', title: 'Nhà Giả Kim', author: 'Paulo Coelho', coverUrl: 'https://picsum.photos/seed/B001/200/300', total: 10, available: 5 },
  { id: 'B002', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', coverUrl: 'https://picsum.photos/seed/B002/200/300', total: 15, available: 12 },
  { id: 'B003', title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', author: 'Nguyễn Nhật Ánh', coverUrl: 'https://picsum.photos/seed/B003/200/300', total: 8, available: 2 },
  { id: 'B004', title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', coverUrl: 'https://picsum.photos/seed/B004/200/300', total: 20, available: 18 },
  { id: 'B005', title: 'Harry Potter và Hòn Đá Phù Thủy', author: 'J.K. Rowling', coverUrl: 'https://picsum.photos/seed/B005/200/300', total: 12, available: 10 },
  { id: 'B006', title: 'Sapiens: Lược Sử Loài Người', author: 'Yuval Noah Harari', coverUrl: 'https://picsum.photos/seed/B006/200/300', total: 7, available: 7 },
  { id: 'B007', title: 'Số Đỏ', author: 'Vũ Trọng Phụng', coverUrl: 'https://picsum.photos/seed/B007/200/300', total: 5, available: 1 },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'S001', name: 'Nguyễn Văn An', class: '12A1', email: 'an.nv@example.com', phone: '0901234567' },
  { id: 'S002', name: 'Trần Thị Bình', class: '11B2', email: 'binh.tt@example.com', phone: '0912345678' },
  { id: 'S003', name: 'Lê Minh Cường', class: '10C3', email: 'cuong.lm@example.com', phone: '0923456789' },
  { id: 'S004', name: 'Phạm Thị Dung', class: '12A1', email: 'dung.pt@example.com', phone: '0934567890' },
  { id: 'S005', name: 'Hoàng Văn Em', class: '11B2', email: 'em.hv@example.com', phone: '0945678901' },
  { id: 'S006', name: 'Vũ Thị Giang', class: '10C3', email: 'giang.vt@example.com', phone: '0956789012' },
];

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const MOCK_LOANS: Loan[] = [
  { id: 'L001', studentId: 'S001', bookId: 'B001', borrowDate: addDays(today, -20).toISOString(), dueDate: addDays(today, -5).toISOString() },
  { id: 'L002', studentId: 'S002', bookId: 'B002', borrowDate: addDays(today, -10).toISOString(), dueDate: addDays(today, 5).toISOString() },
  { id: 'L003', studentId: 'S001', bookId: 'B003', borrowDate: addDays(today, -5).toISOString(), dueDate: addDays(today, 10).toISOString() },
  { id: 'L004', studentId: 'S003', bookId: 'B004', borrowDate: addDays(today, -30).toISOString(), dueDate: addDays(today, -15).toISOString() },
  { id: 'L005', studentId: 'S004', bookId: 'B005', borrowDate: addDays(today, -2).toISOString(), dueDate: addDays(today, 13).toISOString() },
  { id: 'L006', studentId: 'S001', bookId: 'B002', borrowDate: addDays(today, -40).toISOString(), dueDate: addDays(today, -25).toISOString() },
  { id: 'L007', studentId: 'S002', bookId: 'B001', borrowDate: addDays(today, -1).toISOString(), dueDate: addDays(today, 14).toISOString() },
  { id: 'L008', studentId: 'S005', bookId: 'B007', borrowDate: addDays(today, -60).toISOString(), dueDate: addDays(today, -45).toISOString() },
  { id: 'L009', studentId: 'S003', bookId: 'B003', borrowDate: addDays(today, -8).toISOString(), dueDate: addDays(today, 7).toISOString() },
  { id: 'L010', studentId: 'S001', bookId: 'B004', borrowDate: addDays(today, -12).toISOString(), dueDate: addDays(today, 3).toISOString() },
];

export const MOCK_EQUIPMENT: Equipment[] = [
    { id: 'E001', name: 'Máy tính để bàn', quantity: 10, status: 'Hoạt động' },
    { id: 'E002', name: 'Máy in', quantity: 2, status: 'Hoạt động' },
    { id: 'E003', name: 'Máy chiếu', quantity: 1, status: 'Bảo trì' },
    { id: 'E004', name: 'Quạt cây', quantity: 4, status: 'Hoạt động' },
    { id: 'E005', name: 'Bảng trắng', quantity: 3, status: 'Hoạt động' },
];
