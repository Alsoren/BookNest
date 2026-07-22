package com.booknest.service;

import com.booknest.dto.CategoryPreferenceResponse;
import com.booknest.model.*;
import com.booknest.repository.BookRepository;
import com.booknest.repository.UserBookRepository;
import com.booknest.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

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

    public void removeBookFromUser(
            String email,
            Long bookId
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kullanıcı bulunamadı"
                        )
                );

        UserBook userBook = userBookRepository
                .findByUserIdAndBookId(
                        user.getId(),
                        bookId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kitap kullanıcının kütüphanesinde bulunamadı"
                        )
                );

        userBookRepository.delete(userBook);
    }

    public List<UserBook> getUserBooks(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı")
                );

        return userBookRepository.findByUserId(user.getId());
    }


    public UserBook getMyBook(
            String email,
            Long bookId
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kullanıcı bulunamadı"
                        )
                );

        return userBookRepository
                .findByUserIdAndBookId(
                        user.getId(),
                        bookId
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kitap kullanıcının kütüphanesinde bulunmuyor"
                        )
                );
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

    public UserBook updateReadingStatus(
            String email,
            Long bookId,
            ReadingStatus readingStatus
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kullanıcı bulunamadı"
                        )
                );

        UserBook userBook = userBookRepository
                .findByUserIdAndBookId(
                        user.getId(),
                        bookId
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kitap kullanıcının kütüphanesinde bulunmuyor"
                        )
                );

        userBook.setReadingStatus(readingStatus);

        return userBookRepository.save(userBook);
    }

    @Transactional(readOnly = true)
    public List<CategoryPreferenceResponse>
    getMostPreferredCategories(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new RuntimeException(
                        "Kullanıcı bulunamadı"
                ));

        List<UserBook> userBooks =
                userBookRepository.findByUserId(
                        user.getId()
                );

        Map<Long, CategoryPreferenceResponse>
                categoryCounts = new HashMap<>();

        for (UserBook userBook : userBooks){
            Book book = userBook.getBook();

            if (
                    book == null || book.getCategories() == null
            ){
                continue;
            }

            for (Category category : book.getCategories()) {
                CategoryPreferenceResponse existing =
                        categoryCounts.get(
                                category.getId()
                        );
                if (existing == null) {
                    categoryCounts.put(
                            category.getId(),
                            new CategoryPreferenceResponse(
                                    category.getId(),
                                    category.getName(),
                                    1
                            )
                    );
                }else {

                    existing.setBookCount(
                            existing.getBookCount() +  1
                    );
                }
            }
        }

        List<CategoryPreferenceResponse> result =
                new ArrayList<>(
                        categoryCounts.values()
                );

        result.sort(
                Comparator.comparing(
                        CategoryPreferenceResponse :: getBookCount
                ).reversed().thenComparing(CategoryPreferenceResponse :: getCategoryName)
        );

        return result;
    }
}