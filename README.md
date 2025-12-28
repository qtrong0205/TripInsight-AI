# TripInsight AI 🌍✨

> Nền tảng gợi ý địa điểm du lịch thông minh dựa trên AI

TripInsight AI là một ứng dụng web giúp người dùng tìm kiếm, khám phá và nhận gợi ý các địa điểm du lịch dựa trên nhu cầu cá nhân. Ứng dụng kết hợp frontend hiện đại, backend mạnh mẽ và AI để mang đến trải nghiệm cá nhân hóa tối ưu.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat&logo=express)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss)

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [API Endpoints](#-api-endpoints)
- [Biến môi trường](#-biến-môi-trường)

## ✨ Tính năng

### Người dùng
- 🔍 **Tìm kiếm địa điểm** - Tìm kiếm địa điểm du lịch theo tên, vị trí
- 🏷️ **Lọc theo danh mục** - Lọc theo Beach, Mountain, City, Historical, Nature, Adventure
- ⭐ **Lọc theo đánh giá** - Lọc địa điểm theo rating và sentiment score
- 🌏 **Lọc theo quốc gia** - Việt Nam, Japan, USA, England, Singapore
- 📊 **Sắp xếp** - Theo mới nhất, phổ biến nhất, đánh giá cao nhất
- ❤️ **Yêu thích** - Lưu các địa điểm yêu thích
- 👤 **Tài khoản** - Đăng ký, đăng nhập, cập nhật thông tin cá nhân

### Admin
- 📊 **Dashboard** - Thống kê tổng quan về địa điểm
- ➕ **Thêm địa điểm** - Tạo địa điểm mới với upload ảnh
- ✏️ **Quản lý địa điểm** - Xem, sửa, xóa địa điểm
- 🔘 **Bộ lọc Admin** - Lọc theo trạng thái Active/Inactive/Featured

### AI Features
- 🤖 **Sentiment Analysis** - Phân tích cảm xúc từ review người dùng
- 📈 **AI Sentiment Score** - Điểm số đánh giá tổng hợp từ AI (0-100)
- 🗺️ **Tự động tạo bản đồ** - Generate static map URL từ tọa độ

## 🏗 Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄───►│    Backend      │◄───►│    Supabase     │
│   (React/Vite)  │     │   (Express)     │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │   Geoapify API  │
                        │   (Map & Geo)   │
                        │                 │
                        └─────────────────┘
```

### Luồng dữ liệu

1. **User → Frontend**: Người dùng tương tác với giao diện React
2. **Frontend → Backend**: Gửi request qua REST API
3. **Backend → Supabase**: Query/mutation dữ liệu
4. **Backend → Geoapify**: Lấy tọa độ và tạo static map
5. **Backend → Frontend**: Trả về dữ liệu đã xử lý
6. **Frontend → User**: Hiển thị kết quả

## 🛠 Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 18.2.0 | UI Library |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 4.x | Build tool & Dev server |
| TailwindCSS | 3.4.16 | Utility-first CSS |
| React Router | 6.8.1 | Client-side routing |
| TanStack Query | 5.90.12 | Data fetching & caching |
| React Hook Form | 7.68.0 | Form validation |
| Zod | 4.1.13 | Schema validation |
| Radix UI | Latest | Accessible UI components |
| Lucide React | 0.544.0 | Icon library |

### Backend
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Node.js | 18+ | Runtime environment |
| Express | 5.2.1 | Web framework |
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Supabase JS | 2.86.2 | Database client |
| Zod | 4.1.13 | Request validation |
| CORS | 2.8.5 | Cross-origin resource sharing |

### Database & Services
| Service | Mô tả |
|---------|-------|
| Supabase | PostgreSQL database + Auth + Storage |
| Geoapify | Geocoding & Static Map API |

## 📁 Cấu trúc dự án

```
project/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── api/                 # API call functions
│   │   │   └── location.api.ts
│   │   ├── components/          # Reusable components
│   │   │   ├── ui/              # Shadcn/Radix UI components
│   │   │   ├── AppShell.tsx
│   │   │   ├── CategoryChip.tsx
│   │   │   ├── DestinationCard.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── contexts/            # React Contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── favorites/
│   │   │   │   ├── FavoritesContext.tsx
│   │   │   │   └── useFavorites.ts
│   │   │   └── useAuth.ts
│   │   ├── data/                # Type definitions
│   │   │   └── destinations.ts
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── location.queries.ts
│   │   │   ├── use-mobile.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/                 # Utilities
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   ├── pages/               # Page components
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── DestinationForm.tsx
│   │   │   │   └── DestinatiosManagement.tsx
│   │   │   ├── DestinationDetails.tsx
│   │   │   ├── Favorites.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Register.tsx
│   │   │   └── UpdateProfile.tsx
│   │   ├── App.tsx              # Root component
│   │   └── index.tsx            # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── config/              # Configuration
│   │   │   ├── env.ts
│   │   │   └── supabase.ts
│   │   ├── data/                # Type definitions
│   │   │   └── location.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   └── auth.middleware.ts
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── favorites/
│   │   │   │   ├── favorite.controller.ts
│   │   │   │   ├── favorite.model.ts
│   │   │   │   ├── favorite.route.ts
│   │   │   │   └── favorite.service.ts
│   │   │   └── location/
│   │   │       ├── location.controller.ts
│   │   │       ├── location.model.ts
│   │   │       ├── location.route.ts
│   │   │       └── location.service.ts
│   │   ├── scripts/             # Utility scripts
│   │   │   └── fetchAndInsert.ts
│   │   ├── service/             # Shared services
│   │   │   ├── geoapify.service.ts
│   │   │   └── place.service.ts
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.x
- npm hoặc yarn
- Tài khoản Supabase
- API Key Geoapify (optional)

### 1. Clone dự án

```bash
git clone https://github.com/qtrong0205/TripInsight-AI.git
cd TripInsight-AI
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEOAPIFY_API_KEY=your_geoapify_api_key
```

Chạy backend:

```bash
# Development mode
npm run dev

# Production
npm run build
npm start
```

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Chạy frontend:

```bash
# Development mode
npm run dev

# Build for production
npm run build
```

### 4. Truy cập ứng dụng

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📡 API Endpoints

### Locations

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/locations` | Lấy danh sách địa điểm (có phân trang & filter) | ❌ |
| GET | `/api/locations/:slug` | Lấy chi tiết địa điểm theo slug | ❌ |
| GET | `/api/locations/similar/:id` | Lấy địa điểm tương tự | ❌ |
| GET | `/api/locations/admin` | Lấy danh sách (Admin) | ✅ |
| GET | `/api/locations/admin/stat` | Thống kê địa điểm | ✅ |
| POST | `/api/locations` | Tạo địa điểm mới | ✅ |
| PUT | `/api/locations/:id/active` | Cập nhật trạng thái active | ✅ |

**Query Parameters cho GET `/api/locations`:**

| Param | Type | Mô tả |
|-------|------|-------|
| page | number | Số trang (default: 1) |
| limit | number | Số lượng/trang (default: 10, max: 100) |
| categories | string | Danh mục (comma-separated) |
| rating | number | Rating tối thiểu |
| sentimentScore | number | Sentiment score tối thiểu |
| sort | string | `newest` \| `popular` \| `rating` |
| active | boolean | Trạng thái active (Admin only) |
| featured | boolean | Trạng thái featured (Admin only) |

### Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth` | Tạo user mới | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | ✅ |

### Favorites

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/favorites` | Lấy danh sách yêu thích | ✅ |
| POST | `/api/favorites` | Thêm địa điểm yêu thích | ✅ |
| DELETE | `/api/favorites/:placeId` | Xóa địa điểm yêu thích | ✅ |

## 🔐 Biến môi trường

### Backend (.env)

```env
# Server
PORT=3000

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Geoapify (for geocoding & maps)
GEOAPIFY_API_KEY=your_api_key
```

### Frontend (.env)

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000/api

# Supabase Client
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## 📊 Database Schema

### Tables

**places**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| name | text | Tên địa điểm |
| location | text | Vị trí/địa chỉ |
| description | text | Mô tả chi tiết |
| image | text[] | Danh sách URL ảnh |
| categories | text[] | Danh mục |
| lat | float | Latitude |
| lon | float | Longitude |
| static_map_url | text | URL static map |
| rating | float | Điểm đánh giá trung bình |
| reviews | int | Số lượng review |
| avg_sentiment_score | float | Điểm sentiment trung bình |
| is_featured | boolean | Địa điểm nổi bật |
| active | boolean | Trạng thái hiển thị |
| created_at | timestamp | Ngày tạo |

**users**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (from Supabase Auth) |
| email | text | Email |
| name | text | Tên hiển thị |
| role | text | `user` \| `admin` |
| created_at | timestamp | Ngày đăng ký |

**favorites**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key → users |
| place_id | uuid | Foreign key → places |
| created_at | timestamp | Ngày lưu |

## 🤝 Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án được phân phối dưới giấy phép ISC. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác giả

- **qtrong0205** - [GitHub](https://github.com/qtrong0205)

---

<p align="center">
  Made with ❤️ by TripInsight AI Team
</p>
