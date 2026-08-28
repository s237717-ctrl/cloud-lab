# Câu 51: 
FROM node:20-alpine

# Câu 52: 
WORKDIR /app

# Câu 53: 
COPY package*.json ./

# Câu 54:
RUN npm install

# Câu 55: 
COPY . .

# Câu 56: 
RUN npm run build

# Cài đặt serve để host các file tĩnh sau khi build
RUN npm install -g serve

# Lệnh khởi chạy server phục vụ thư mục dist ở port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]