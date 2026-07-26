package com.booknest.repository;

import com.booknest.model.Friendship;
import com.booknest.model.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository
        extends JpaRepository<Friendship, Long> {

    /*
     * Aynı yönde bir arkadaşlık kaydı var mı?
     *
     * Örnek:
     * senderId = 1
     * receiverId = 2
     */
    boolean existsBySenderIdAndReceiverId(
            Long senderId,
            Long receiverId
    );

    /*
     * Belirli yöndeki arkadaşlık kaydını getirir.
     */
    Optional<Friendship> findBySenderIdAndReceiverId(
            Long senderId,
            Long receiverId
    );

    /*
     * Kullanıcıya gelen ve belirli durumda olan istekler.
     *
     * Örnek:
     * receiverId = giriş yapan kullanıcı
     * status = PENDING
     */
    List<Friendship> findByReceiverIdAndStatus(
            Long receiverId,
            FriendshipStatus status
    );

    /*
     * Kullanıcının gönderdiği ve belirli durumda olan istekler.
     */
    List<Friendship> findBySenderIdAndStatus(
            Long senderId,
            FriendshipStatus status
    );

    /*
     * İki kullanıcı arasında herhangi bir yönde
     * arkadaşlık kaydı bulunuyor mu?
     *
     * 1 → 2 veya 2 → 1
     */
    @Query("""
            SELECT f
            FROM Friendship f
            WHERE
                (f.sender.id = :firstUserId
                 AND f.receiver.id = :secondUserId)
                OR
                (f.sender.id = :secondUserId
                 AND f.receiver.id = :firstUserId)
            """)
    Optional<Friendship> findRelationshipBetweenUsers(
            @Param("firstUserId") Long firstUserId,
            @Param("secondUserId") Long secondUserId
    );

    /*
     * Kullanıcının kabul edilmiş bütün arkadaşlıkları.
     *
     * Kullanıcı hem sender hem de receiver tarafında olabilir.
     */
    @Query("""
            SELECT f
            FROM Friendship f
            WHERE f.status = 'ACCEPTED'
              AND (
                    f.sender.id = :userId
                    OR f.receiver.id = :userId
                  )
            ORDER BY f.updatedAt DESC
            """)
    List<Friendship> findAcceptedFriendshipsByUserId(
            @Param("userId") Long userId
    );
}