
import { GoogleGenAI, Type } from "@google/genai";

// IMPORTANT: The API key must be set in your environment variables.
// Do not hardcode the API key in the code.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Google GenAI is not set in environment variables. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const studentSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Mã số học sinh" },
      name: { type: Type.STRING, description: "Họ và tên học sinh" },
      class: { type: Type.STRING, description: "Lớp" },
      email: { type: Type.STRING, description: "Email" },
      phone: { type: Type.STRING, description: "Số điện thoại" },
    },
     required: ["id", "name", "class"],
  },
};

const bookSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: 'Mã sách' },
            title: { type: Type.STRING, description: 'Tên sách' },
            author: { type: Type.STRING, description: 'Tác giả' },
            total: { type: Type.NUMBER, description: 'Tổng số lượng' },
            available: { type: Type.NUMBER, description: 'Số lượng có sẵn' },
        },
        required: ['id', 'title', 'author', 'total', 'available'],
    }
};

export const parseDataWithGemini = async <T,>(
  textData: string,
  type: 'student' | 'book'
): Promise<T[] | null> => {
  if (!API_KEY) {
    alert("Chức năng AI chưa được cấu hình. Vui lòng thiết lập API Key.");
    return null;
  }

  const prompt = `Phân tích dữ liệu văn bản sau đây và chuyển đổi nó thành một mảng JSON dựa trên schema đã cho. Dữ liệu: \n\n${textData}`;
  const schema = type === 'student' ? studentSchema : bookSchema;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const jsonText = response.text.trim();
    if (jsonText) {
      return JSON.parse(jsonText) as T[];
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    alert("Đã xảy ra lỗi khi phân tích dữ liệu bằng AI. Vui lòng kiểm tra console log.");
    return null;
  }
};
