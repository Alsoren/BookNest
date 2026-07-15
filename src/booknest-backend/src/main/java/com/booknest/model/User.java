package com.booknest.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private boolean agreeToUpdates;

    public User(){

    }
    public User(String name, String email, String password, boolean agreeToUpdates) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.agreeToUpdates = agreeToUpdates;
    }

}
