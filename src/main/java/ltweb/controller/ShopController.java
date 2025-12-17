package ltweb.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import jakarta.validation.Valid;
import ltweb.entity.Category;
import ltweb.entity.Product;
import ltweb.entity.User;
import ltweb.model.CategoryInput; // Bạn cần tạo class/record này
import ltweb.model.ProductInput; // Bạn cần tạo class/record này
import ltweb.model.UserInput;    // Bạn cần tạo class/record này
import ltweb.repository.CategoryRepository;
import ltweb.repository.ProductRepository;
import ltweb.repository.UserRepository;

@Controller
public class ShopController {

    @Autowired private ProductRepository productRepo;
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private UserRepository userRepo;

    @QueryMapping
    public List<Product> productsSortedByPrice() {
        return productRepo.findAllByOrderByPriceAsc();
    }

    @QueryMapping
    public List<Product> productsByCategory(@Argument Integer categoryId) {
        return productRepo.findByCategoryId(categoryId);
    }
    
    @QueryMapping
    public Optional<Product> getProductById(@Argument Integer id) {
        return productRepo.findById(id);
    }

    @QueryMapping
    public List<User> getAllUsers() { return userRepo.findAll(); }
    
    @QueryMapping
    public List<Category> getAllCategories() { return categoryRepo.findAll(); }
    
    @MutationMapping
    public Product createProduct(@Argument @Valid ProductInput product) { // Thêm @Valid
        Product p = new Product();
        p.setTitle(product.getTitle());
        p.setPrice(product.getPrice());
        p.setQuantity(product.getQuantity());
        p.setDesc(product.getDesc());
        p.setUserId(product.getUserId());
        
        if (product.getCategoryId() != null) {
            Category c = categoryRepo.findById(product.getCategoryId()).orElse(null);
            p.setCategory(c);
        }
        return productRepo.save(p);
    }
    
    @MutationMapping
    public Product updateProduct(@Argument Integer id, @Argument ProductInput product) {
        Product p = productRepo.findById(id).orElse(null);
        if (p != null) {
            if(product.getTitle() != null) p.setTitle(product.getTitle());
            if(product.getPrice() != null) p.setPrice(product.getPrice());
            if(product.getQuantity() != null) p.setQuantity(product.getQuantity());
            if(product.getDesc() != null) p.setDesc(product.getDesc());
            if(product.getUserId() != null) p.setUserId(product.getUserId());
            
            if (product.getCategoryId() != null) {
                Category c = categoryRepo.findById(product.getCategoryId()).orElse(null);
                p.setCategory(c);
            }
            return productRepo.save(p);
        }
        return null;
    }

    @MutationMapping
    public String deleteProduct(@Argument Integer id) {
        if(productRepo.existsById(id)) {
            productRepo.deleteById(id);
            return "Deleted product with id: " + id;
        }
        return "Product not found";
    }

    @MutationMapping
    public User createUser(@Argument @Valid UserInput user) {
        User u = new User();
        u.setFullname(user.getFullname());
        u.setEmail(user.getEmail());
        u.setPassword(user.getPassword());
        u.setPhone(user.getPhone());
        u.setRole(user.getRole() != null ? user.getRole() : "USER"); 
        return userRepo.save(u);
    }

    @MutationMapping
    public User updateUser(@Argument Integer id, @Argument UserInput user) {
        User u = userRepo.findById(id).orElse(null);
        if (u != null) {
            if(user.getFullname() != null) u.setFullname(user.getFullname());
            if(user.getEmail() != null) u.setEmail(user.getEmail());
            if(user.getPassword() != null) u.setPassword(user.getPassword());
            if(user.getPhone() != null) u.setPhone(user.getPhone());
            return userRepo.save(u);
        }
        return null;
    }

    @MutationMapping
    public String deleteUser(@Argument Integer id) {
        if(userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return "Deleted user with id: " + id;
        }
        return "User not found";
    }

    @MutationMapping
    public Category createCategory(@Argument @Valid CategoryInput category) {
        Category c = new Category();
        c.setName(category.getName());
        c.setImages(category.getImages());
        return categoryRepo.save(c);
    }

    @MutationMapping
    public Category updateCategory(@Argument Integer id, @Argument CategoryInput category) {
        Category c = categoryRepo.findById(id).orElse(null);
        if (c != null) {
            if(category.getName() != null) c.setName(category.getName());
            if(category.getImages() != null) c.setImages(category.getImages());
            return categoryRepo.save(c);
        }
        return null;
    }

    @MutationMapping
    public String deleteCategory(@Argument Integer id) {
        if(categoryRepo.existsById(id)) {
            categoryRepo.deleteById(id);
            return "Deleted category with id: " + id;
        }
        return "Category not found";
    }
}