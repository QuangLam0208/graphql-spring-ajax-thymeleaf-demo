package ltweb.model;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductInput {
    private String title;
    private Integer quantity;
    private String desc;
    private BigDecimal price;
    private Integer userId;
    private Integer categoryId;
}