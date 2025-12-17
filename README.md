# GraphQL Spring Boot Shop Demo

Đây là dự án demo môn **Lập trình Web**, xây dựng hệ thống quản lý cửa hàng (**Shop Management**) sử dụng **Spring Boot**, **GraphQL**, **Thymeleaf** và **AJAX**. Dự án minh họa cách tích hợp API GraphQL vào mô hình MVC truyền thống, xử lý phân quyền (**Authorization**) bằng **Interceptor** và kiểm lỗi dữ liệu (**Validation**).

## Tính Năng Chính

* **Quản lý (CRUD) qua GraphQL:**

  * **Sản phẩm (Products):** Thêm, xóa, sửa, xem danh sách, sắp xếp theo giá.
  * **Danh mục (Categories):** Quản lý danh mục sản phẩm.
  * **Người dùng (Users):** Quản lý thông tin tài khoản.

* **Xác thực & Phân quyền (Auth & Security):**

  * Đăng nhập (Login) sử dụng `HttpSession`.
  * **Interceptor** bảo vệ các đường dẫn:

    * `AdminInterceptor`: Chỉ cho phép role `ADMIN` truy cập `/admin/**`.
    * `UserInterceptor`: Yêu cầu đăng nhập để truy cập `/user/**`.

* **Validation (Kiểm lỗi):**

  * Kiểm tra dữ liệu đầu vào ngay từ phía Server (tên không được để trống, giá phải dương, mật khẩu tối thiểu 6 ký tự...).

* **Giao diện:**

  * Sử dụng **Thymeleaf** kết hợp với **AJAX (Fetch API)** để gọi GraphQL mà không cần tải lại trang.

## Công Nghệ Sử Dụng

* **Backend:** Java 21, Spring Boot 3.5.8
* **Database:** Microsoft SQL Server
* **API:** Spring GraphQL
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Thymeleaf
* **Build Tool:** Maven

## Yêu Cầu Cài Đặt

1. **Java JDK 21** trở lên.
2. **Microsoft SQL Server** (đã cài đặt và đang chạy).
3. **Maven** (hoặc sử dụng wrapper `./mvnw` có sẵn trong dự án).

## Hướng Dẫn Cài Đặt & Chạy

### Bước 1: Cấu hình Cơ sở dữ liệu

1. Mở **SQL Server Management Studio (SSMS)**.
2. Tạo một database mới tên: `GraphQL_Shop_Demo`.
3. Mở file `src/main/resources/application.properties` và cập nhật thông tin kết nối:

```properties
spring.datasource.url=jdbc:sqlserver://localhost;databaseName=GraphQL_Shop_Demo;trustServerCertificate=true;...
spring.datasource.username=sa
spring.datasource.password=your_password
```

### Bước 2: Khởi chạy ứng dụng

Mở terminal tại thư mục gốc của dự án và chạy:

```bash
./mvnw spring-boot:run
```

*(Hoặc chạy file `GraphqlSpringAjaxThymeleafDemoApplication.java` trong IDE của bạn)*

Ứng dụng sẽ chạy tại: **[http://localhost:8035](http://localhost:8035)**

### Bước 3: Tạo Dữ Liệu Mẫu (Quan Trọng)

Do ứng dụng **chưa có trang Đăng ký (Register UI)**, bạn cần tạo tài khoản **Admin** và **User** thông qua **GraphiQL** trước khi đăng nhập.

1. Truy cập GraphiQL: `http://localhost:8035/graphiql`
2. Chạy mutation sau (mật khẩu ≥ 6 ký tự):

```graphql
mutation {
  # Tạo tài khoản Admin
  createAdmin: createUser(user: {
    fullname: "Quản Trị Viên",
    email: "admin@gmail.com",
    password: "123456",
    phone: "0909123456",
    role: "ADMIN"
  }) {
    id
    fullname
  }

  # Tạo tài khoản User thường
  createGuest: createUser(user: {
    fullname: "Khách Hàng",
    email: "user@gmail.com",
    password: "123456",
    phone: "0909999999",
    role: "USER"
  }) {
    id
    fullname
  }
}
```

## Hướng Dẫn Sử Dụng

### 1. Đăng Nhập

Truy cập `http://localhost:8035/`. Hệ thống sẽ chuyển hướng đến trang **Login**.

**Tài khoản Admin:**

* Email: `admin@gmail.com`
* Password: `123456`
* → Chuyển hướng đến **Dashboard** (`/admin/dashboard`) với đầy đủ quyền quản lý.

**Tài khoản User:**

* Email: `user@gmail.com`
* Password: `123456`
* → Chuyển hướng đến **Trang chủ** (`/user/home`) chỉ có quyền xem sản phẩm.

### 2. Kiểm thử Phân Quyền (Interceptor)

* Đăng nhập bằng **User**, thử truy cập `/admin/dashboard` → bị chặn và chuyển về User Home.
* Chưa đăng nhập mà truy cập `/admin/**` hoặc `/user/**` → bị chuyển về Login.

### 3. Kiểm thử Validation

* Đăng nhập Admin → tab **Sản Phẩm**.
* Thêm sản phẩm nhưng để trống **Tên** hoặc nhập **Giá âm**.
* Hệ thống hiển thị thông báo lỗi trả về từ **GraphQL Server**.

## Cấu Trúc Thư Mục

```text
src/main/java/ltweb
├── config          # Cấu hình MVC, Interceptor (WebMvcConfig.java)
├── controller      # AuthController (Login), ShopController (GraphQL & MVC)
├── entity          # User, Product, Category (JPA Entities)
├── interceptor     # AdminInterceptor.java, UserInterceptor.java
├── model           # Input DTOs (UserInput, ProductInput...)
└── repository      # JPA Repositories
```
