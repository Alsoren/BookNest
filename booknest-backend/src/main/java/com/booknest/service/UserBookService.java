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
            Long userId,
            Long bookId,
            ReadingStatus readingStatus
    ){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Kitap bulunamadı"));

        boolean alreadyExists = userBookRepository.existsByUserIdAndBookId(
                userId,
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
                .favorite(false)
                .build();

        return userBookRepository.save(userBook);
    }

    public List <UserBook> getUserBooks(Long userId){
        return userBookRepository.findByUserId(userId);
    }

    public List<UserBook> getUserBooksByStatus(
            Long userId,
            ReadingStatus readingStatus
    ){
        return userBookRepository
                .findByUserIdAndReadingStatus(
                        userId,
                        readingStatus
                );
    }
}
