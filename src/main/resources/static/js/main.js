
const API_URL = '/graphql';

async function fetchGraphQL(query) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const json = await res.json();
        if (json.errors) {
            alert("Lỗi: " + json.errors[0].message);
            return null;
        }
        return json.data;
    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối Server!");
        return null;
    }
}

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Tìm button nào gọi hàm này để active (dùng event.currentTarget an toàn hơn)
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if(btn.textContent.includes(tabName === 'products' ? 'Sản Phẩm' : tabName === 'categories' ? 'Danh Mục' : 'Người Dùng')) {
            btn.classList.add('active');
        }
    });

    // Cách đơn giản hơn nếu truyền event vào function, nhưng ở đây ta xử lý logic DOM
    const targetTab = document.getElementById(tabName);
    if(targetTab) targetTab.classList.add('active');

    if(tabName === 'products') loadProducts();
    if(tabName === 'categories') loadCategories();
    if(tabName === 'users') loadUsers();
}

// Logic TAB CLICK EVENT (Gán class active cho nút bấm)
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    // Load mặc định
    loadProducts();
});


// ================= LOGIC PRODUCT =================
let productList = []; 

async function loadProducts() {
    const query = `query { productsSortedByPrice { id title price quantity desc userId category { id name } } }`;
    const data = await fetchGraphQL(query);
    if (!data) return;
    
    productList = data.productsSortedByPrice;
    const html = productList.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><b>${p.title}</b></td>
            <td>${p.price.toLocaleString()}</td>
            <td>${p.category ? p.category.name : '-'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
    document.getElementById('p-table').innerHTML = html;
}

async function saveProduct() {
    const id = document.getElementById('p-id').value;
    const input = {
        title: document.getElementById('p-title').value,
        price: parseFloat(document.getElementById('p-price').value),
        quantity: parseInt(document.getElementById('p-qty').value),
        desc: document.getElementById('p-desc').value,
        userId: parseInt(document.getElementById('p-userId').value),
        categoryId: parseInt(document.getElementById('p-catId').value)
    };

    let query = '';
    if (id) {
        query = `mutation { updateProduct(id: ${id}, product: { title: "${input.title}", price: ${input.price}, quantity: ${input.quantity}, desc: "${input.desc}", userId: ${input.userId}, categoryId: ${input.categoryId} }) { id } }`;
    } else {
        query = `mutation { createProduct(product: { title: "${input.title}", price: ${input.price}, quantity: ${input.quantity}, desc: "${input.desc}", userId: ${input.userId}, categoryId: ${input.categoryId} }) { id } }`;
    }

    const data = await fetchGraphQL(query);
    if (data) {
        resetProductForm();
        loadProducts();
    }
}

function editProduct(id) {
    const p = productList.find(item => item.id == id);
    if (!p) return;
    document.getElementById('p-id').value = p.id;
    document.getElementById('p-title').value = p.title;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-qty').value = p.quantity;
    document.getElementById('p-desc').value = p.desc;
    document.getElementById('p-userId').value = p.userId || '';
    document.getElementById('p-catId').value = p.category ? p.category.id : '';
    
    document.getElementById('p-form-title').innerText = "Cập nhật sản phẩm #" + id;
    document.getElementById('p-cancel-btn').style.display = 'inline-block';
}

function resetProductForm() {
    document.getElementById('p-id').value = '';
    document.getElementById('p-title').value = '';
    document.getElementById('p-price').value = '';
    document.getElementById('p-form-title').innerText = "Thêm Sản Phẩm Mới";
    document.getElementById('p-cancel-btn').style.display = 'none';
}

async function deleteProduct(id) {
    if(!confirm('Bạn chắc chắn muốn xóa?')) return;
    const query = `mutation { deleteProduct(id: ${id}) }`;
    await fetchGraphQL(query);
    loadProducts();
}

// ================= LOGIC CATEGORY =================
let categoryList = [];

async function loadCategories() {
    const query = `query { getAllCategories { id name images } }`;
    const data = await fetchGraphQL(query);
    if (!data) return;

    categoryList = data.getAllCategories;
    document.getElementById('c-table').innerHTML = categoryList.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.images || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editCategory(${c.id})">Sửa</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${c.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

async function saveCategory() {
    const id = document.getElementById('c-id').value;
    const name = document.getElementById('c-name').value;
    const images = document.getElementById('c-images').value;

    let query = '';
    if (id) {
        query = `mutation { updateCategory(id: ${id}, category: { name: "${name}", images: "${images}" }) { id } }`;
    } else {
        query = `mutation { createCategory(category: { name: "${name}", images: "${images}" }) { id } }`;
    }
    if(await fetchGraphQL(query)) {
        resetCategoryForm();
        loadCategories();
    }
}

function editCategory(id) {
    const c = categoryList.find(item => item.id == id);
    document.getElementById('c-id').value = c.id;
    document.getElementById('c-name').value = c.name;
    document.getElementById('c-images').value = c.images;
    document.getElementById('c-form-title').innerText = "Sửa Danh Mục #" + id;
    document.getElementById('c-cancel-btn').style.display = 'inline-block';
}

function resetCategoryForm() {
    document.getElementById('c-id').value = '';
    document.getElementById('c-name').value = '';
    document.getElementById('c-images').value = '';
    document.getElementById('c-form-title').innerText = "Thêm Danh Mục";
    document.getElementById('c-cancel-btn').style.display = 'none';
}

async function deleteCategory(id) {
    if(!confirm('Xóa danh mục sẽ ảnh hưởng đến sản phẩm. Tiếp tục?')) return;
    await fetchGraphQL(`mutation { deleteCategory(id: ${id}) }`);
    loadCategories();
}

// ================= LOGIC USER =================
let userList = [];

async function loadUsers() {
    const query = `query { getAllUsers { id fullname email phone } }`;
    const data = await fetchGraphQL(query);
    if (!data) return;

    userList = data.getAllUsers;
    document.getElementById('u-table').innerHTML = userList.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.fullname}</td>
            <td>${u.email}</td>
            <td>${u.phone || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${u.id})">Sửa</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

async function saveUser() {
    const id = document.getElementById('u-id').value;
    const input = {
        fullname: document.getElementById('u-fullname').value,
        email: document.getElementById('u-email').value,
        phone: document.getElementById('u-phone').value,
        pass: document.getElementById('u-pass').value
    };

    let query = '';
    if (id) {
        let passField = input.pass ? `, password: "${input.pass}"` : '';
        query = `mutation { updateUser(id: ${id}, user: { fullname: "${input.fullname}", email: "${input.email}", phone: "${input.phone}" ${passField} }) { id } }`;
    } else {
        query = `mutation { createUser(user: { fullname: "${input.fullname}", email: "${input.email}", phone: "${input.phone}", password: "${input.pass}" }) { id } }`;
    }
    if(await fetchGraphQL(query)) {
        resetUserForm();
        loadUsers();
    }
}

function editUser(id) {
    const u = userList.find(item => item.id == id);
    document.getElementById('u-id').value = u.id;
    document.getElementById('u-fullname').value = u.fullname;
    document.getElementById('u-email').value = u.email;
    document.getElementById('u-phone').value = u.phone;
    document.getElementById('u-pass').placeholder = "Nhập nếu muốn đổi pass mới";
    
    document.getElementById('u-form-title').innerText = "Sửa User #" + id;
    document.getElementById('u-cancel-btn').style.display = 'inline-block';
}

function resetUserForm() {
    document.getElementById('u-id').value = '';
    document.getElementById('u-fullname').value = '';
    document.getElementById('u-email').value = '';
    document.getElementById('u-phone').value = '';
    document.getElementById('u-pass').value = '';
    document.getElementById('u-pass').placeholder = "Mật khẩu";
    document.getElementById('u-form-title').innerText = "Thêm Người Dùng";
    document.getElementById('u-cancel-btn').style.display = 'none';
}

async function deleteUser(id) {
    if(!confirm('Xóa user này?')) return;
    await fetchGraphQL(`mutation { deleteUser(id: ${id}) }`);
    loadUsers();
}