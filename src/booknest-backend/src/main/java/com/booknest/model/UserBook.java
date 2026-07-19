package com.booknest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_books",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "book_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReadingStatus readingStatus = ReadingStatus.valueOf("WANT_TO_READ");

    @Builder.Default
    private boolean favorite = false;

    private Integer rating;

    @Builder.Default
    private LocalDateTime addedAt = LocalDateTime.now();
}