package ltweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ltweb.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

}
