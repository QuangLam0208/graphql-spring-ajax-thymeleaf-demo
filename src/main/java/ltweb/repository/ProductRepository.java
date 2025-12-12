package ltweb.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import ltweb.entity.Product;
public interface ProductRepository extends JpaRepository<Product, Integer> {
	// Tìm tất cả product theo categoryId
    List<Product> findByCategoryId(Integer categoryId);
    
    // Tìm tất cả product sắp xếp theo giá tăng dần
    List<Product> findAllByOrderByPriceAsc();
}
