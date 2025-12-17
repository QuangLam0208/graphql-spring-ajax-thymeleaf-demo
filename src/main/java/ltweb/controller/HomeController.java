package ltweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "redirect:/login";
    }

    @GetMapping("/admin/dashboard")
    public String adminHome() {
        return "index";
    }

    @GetMapping("/user/home")
    public String userHome() {
        return "user-home"; 
    }
}