# Website Course H3

**Website Course H3** là một ứng dụng web cung cấp các khóa học lập trình, được xây dựng với React và Vite. Dự án sử dụng Tailwind CSS để thiết kế giao diện, cùng với nhiều thư viện khác như Redux Toolkit, Axios, và Framer Motion để hỗ trợ phát triển tính năng.

## Mục tiêu dự án
- Cung cấp một nền tảng trực quan và thân thiện để học lập trình.
- Tích hợp các công cụ như QR code, video từ YouTube, và biểu đồ từ Recharts để nâng cao trải nghiệm người dùng.

## Công nghệ sử dụng
- **Frontend**: 
  - [React](https://reactjs.org/) v19.0.0
  - [Vite](https://vitejs.dev/) v6.1.0 (Build tool)
  - [Tailwind CSS](https://tailwindcss.com/) v3.4.17
  - [Framer Motion](https://www.framer.com/motion/) v12.4.7 (Animation)
  - [Redux Toolkit](https://redux-toolkit.js.org/) v2.6.1 (State management)
- **Thư viện UI**:
  - [Radix UI](https://www.radix-ui.com/) (Avatar, Dialog, Dropdown Menu, v.v.)
  - [Shadcn UI](https://ui.shadcn.com/) v0.9.4
  - [Lucide React](https://lucide.dev/) v0.475.0 (Icons)
- **Công cụ khác**:
  - [Axios](https://axios-http.com/) v1.8.4 (HTTP requests)
  - [React Router DOM](https://reactrouter.com/) v7.2.0 (Routing)
  - [Recharts](https://recharts.org/) v2.15.1 (Charts)
  - [React YouTube](https://github.com/tjallingt/react-youtube) v10.1.0 (YouTube video integration)
- **Dev Tools**:
  - [ESLint](https://eslint.org/) v9.19.0 (Linting)
  - [Prettier](https://prettier.io/) v3.5.2 (Code formatting)
  - [PostCSS](https://postcss.org/) v8.5.3
  - [TypeScript](https://www.typescriptlang.org/) (hỗ trợ qua `@types/*`)

## Cài đặt

### Yêu cầu
- Node.js >= 18.0.0
- npm hoặc yarn

### Hướng dẫn cài đặt
1. Clone repository:
   ```bash
   git clone <repository-url>
   cd website-course-h3
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```
   hoặc
   ```bash
   yarn install
   ```

3. Chạy dự án ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   hoặc
   ```bash
   yarn dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc cổng mặc định của Vite).

4. Build dự án:
   ```bash
   npm run build
   ```
   hoặc
   ```bash
   yarn build
   ```

5. Xem trước bản build:
   ```bash
   npm run preview
   ```
   hoặc
   ```bash
   yarn preview
   ```

6. Kiểm tra mã nguồn với ESLint:
   ```bash
   npm run lint
   ```
   hoặc
   ```bash
   yarn lint
   ```

## Cấu trúc dự án
- **`src/`**: Thư mục chính chứa mã nguồn React.
- **`public/`**: Chứa các tài nguyên tĩnh như logo (`LogoH3.png`).
- **`tsconfig.app.json`**: Cấu hình TypeScript với `baseUrl` là `.` và alias `@/*` trỏ tới `src/*`.
- **`index.html`**: File HTML chính, nơi ứng dụng React được gắn vào `#root`.

## Tính năng chính
- **Giao diện người dùng**: Sử dụng Tailwind CSS và Shadcn UI để tạo giao diện hiện đại, responsive.
- **Quản lý trạng thái**: Redux Toolkit để quản lý trạng thái ứng dụng.
- **Tích hợp API**: Sử dụng Axios để gọi API.
- **Hiển thị dữ liệu**: Biểu đồ với Recharts, video từ YouTube với React YouTube.
- **Tương tác**: Hỗ trợ animation với Framer Motion, các thành phần UI từ Radix UI.

## Ghi chú
- Dự án sử dụng Cloudflare để bảo vệ và tối ưu hóa hiệu suất (xem script trong `index.html`).
- Đảm bảo kết nối internet khi chạy để tải các tài nguyên từ CDN.

## Đóng góp
1. Fork repository.
2. Tạo branch mới (`git checkout -b feature/your-feature`).
3. Commit thay đổi (`git commit -m "Add your feature"`).
4. Push lên branch (`git push origin feature/your-feature`).
5. Tạo Pull Request.

## Giấy phép
Dự án này là mã nguồn riêng (`private: true`) và không có giấy phép công khai.

---

File `README.md` trên được thiết kế để cung cấp thông tin cơ bản, dễ hiểu cho người dùng hoặc nhà phát triển muốn làm việc với dự án. Bạn có thể tùy chỉnh thêm nếu cần!
