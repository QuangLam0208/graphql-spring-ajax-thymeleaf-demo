package ltweb.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryInput {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    
    private String images;
}