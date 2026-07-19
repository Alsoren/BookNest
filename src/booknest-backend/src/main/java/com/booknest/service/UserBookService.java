package com.booknest.service;

import com.booknest.model.Book;
import com.booknest.model.ReadingStatus;
import com.booknest.model.User;
import com.booknest.model.UserBook;
import com.booknest.repository.BookRepository;
import com.booknest.repository.UserBookRepository;
import com.booknest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserBookService {

    private final UserBookRepository userBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public UserBook addBookToUser(
            String email,
            Long bookId,
            ReadingStatus readingStatus,
            boolean favorite,
            Integer rating
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı")
                );

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException("Kitap bulunamadı")
                );

        boolean alreadyExists =
                userBookRepository.existsByUserIdAndBookId(
                        user.getId(),
                        bookId
                );

        if (alreadyExists) {
            throw new RuntimeException(
                    "Bu kitap kullanıcının listesinde zaten bulunuyor"
            );
        }

        UserBook userBook = UserBook.builder()
                .user(user)
                .book(book)
                .readingStatus(readingStatus)
                .favorite(favorite)
                .rating(rating)
                .build();

        return userBookRepository.save(userBook);
    }

    public List<UserBook> getUserBooks(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı")
                );

        return userBookRepository.findByUserId(user.getId());
    }

    public List<UserBook> getUserBooksByStatus(
            String email,
            ReadingStatus readingStatus
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı")
                );

        return userBookRepository.findByUserIdAndReadingStatus(
                user.getId(),
                readingStatus
        );
    }
}