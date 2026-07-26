package com.booknest.service;

import com.booknest.dto.FriendUserResponse;
import com.booknest.dto.FriendshipResponse;
import com.booknest.model.Friendship;
import com.booknest.model.FriendshipStatus;
import com.booknest.model.User;
import com.booknest.repository.FriendshipRepository;
import com.booknest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;

    private final UserRepository userRepository;

    /*
     * Arkadaşlık isteği gönderir.
     *
     * senderEmail:
     * JWT içerisinden alınan giriş yapmış
     * kullanıcının email adresidir.
     *
     * receiverId:
     * Arkadaşlık isteği gönderilecek kullanıcının ID'sidir.
     */
    @Transactional
    public FriendshipResponse sendFriendRequest(
            String senderEmail,
            Long receiverId
    ) {
        User sender = findUserByEmail(senderEmail);

        User receiver = userRepository
                .findById(receiverId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Arkadaşlık isteği gönderilecek kullanıcı bulunamadı."
                        )
                );

        /*
         * Kullanıcı kendisine arkadaşlık isteği gönderemez.
         */
        if (Objects.equals(sender.getId(), receiver.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Kendine arkadaşlık isteği gönderemezsin."
            );
        }

        /*
         * İki kullanıcı arasında daha önceden
         * bir arkadaşlık kaydı var mı kontrol edilir.
         *
         * Hem sender -> receiver
         * hem de receiver -> sender yönü kontrol edilir.
         */
        Friendship existingFriendship =
                friendshipRepository
                        .findRelationshipBetweenUsers(
                                sender.getId(),
                                receiver.getId()
                        )
                        .orElse(null);

        if (existingFriendship != null) {

            /*
             * Zaten arkadaşlarsa yeniden istek gönderilemez.
             */
            if (
                    existingFriendship.getStatus()
                            == FriendshipStatus.ACCEPTED
            ) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Bu kullanıcıyla zaten arkadaşsın."
                );
            }

            /*
             * Bekleyen bir istek varsa yeni kayıt oluşturulmaz.
             */
            if (
                    existingFriendship.getStatus()
                            == FriendshipStatus.PENDING
            ) {
                boolean currentUserIsSender =
                        Objects.equals(
                                existingFriendship
                                        .getSender()
                                        .getId(),
                                sender.getId()
                        );

                if (currentUserIsSender) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Bu kullanıcıya zaten arkadaşlık isteği gönderdin."
                    );
                }

                /*
                 * Karşı kullanıcı daha önce giriş yapan
                 * kullanıcıya istek göndermiştir.
                 */
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Bu kullanıcı sana zaten arkadaşlık isteği göndermiş."
                );
            }

            /*
             * Daha önce reddedilmiş bir istek varsa
             * aynı kayıt yeniden PENDING durumuna getirilir.
             *
             * Yeni bir veritabanı satırı oluşturulmaz.
             */
            if (
                    existingFriendship.getStatus()
                            == FriendshipStatus.REJECTED
            ) {
                existingFriendship.setSender(sender);
                existingFriendship.setReceiver(receiver);
                existingFriendship.setStatus(
                        FriendshipStatus.PENDING
                );

                Friendship savedFriendship =
                        friendshipRepository.save(
                                existingFriendship
                        );

                return convertToResponse(
                        savedFriendship
                );
            }
        }

        /*
         * İki kullanıcı arasında daha önce bir ilişki
         * bulunmuyorsa yeni arkadaşlık isteği oluşturulur.
         */
        Friendship friendship = Friendship.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendshipStatus.PENDING)
                .build();

        Friendship savedFriendship =
                friendshipRepository.save(friendship);

        return convertToResponse(savedFriendship);
    }

    /*
     * Gelen arkadaşlık isteğini kabul eder.
     */
    @Transactional
    public FriendshipResponse acceptFriendRequest(
            String receiverEmail,
            Long friendshipId
    ) {
        User receiver =
                findUserByEmail(receiverEmail);

        Friendship friendship =
                findFriendshipById(friendshipId);

        /*
         * İsteği yalnızca isteği alan kullanıcı
         * kabul edebilir.
         */
        verifyRequestReceiver(
                friendship,
                receiver
        );

        /*
         * Sadece PENDING durumundaki istek
         * kabul edilebilir.
         */
        if (
                friendship.getStatus()
                        != FriendshipStatus.PENDING
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bu arkadaşlık isteği artık beklemede değil."
            );
        }

        friendship.setStatus(
                FriendshipStatus.ACCEPTED
        );

        Friendship savedFriendship =
                friendshipRepository.save(friendship);

        return convertToResponse(savedFriendship);
    }

    /*
     * Gelen arkadaşlık isteğini reddeder.
     */
    @Transactional
    public FriendshipResponse rejectFriendRequest(
            String receiverEmail,
            Long friendshipId
    ) {
        User receiver =
                findUserByEmail(receiverEmail);

        Friendship friendship =
                findFriendshipById(friendshipId);

        /*
         * İsteği yalnızca isteği alan kullanıcı
         * reddedebilir.
         */
        verifyRequestReceiver(
                friendship,
                receiver
        );

        if (
                friendship.getStatus()
                        != FriendshipStatus.PENDING
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bu arkadaşlık isteği artık beklemede değil."
            );
        }

        friendship.setStatus(
                FriendshipStatus.REJECTED
        );

        Friendship savedFriendship =
                friendshipRepository.save(friendship);

        return convertToResponse(savedFriendship);
    }

    /*
     * Giriş yapan kullanıcıya gelen bekleyen
     * arkadaşlık isteklerini getirir.
     */
    @Transactional(readOnly = true)
    public List<FriendshipResponse>
    getIncomingPendingRequests(
            String receiverEmail
    ) {
        User receiver =
                findUserByEmail(receiverEmail);

        return friendshipRepository
                .findByReceiverIdAndStatus(
                        receiver.getId(),
                        FriendshipStatus.PENDING
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    /*
     * Giriş yapan kullanıcının gönderdiği
     * bekleyen arkadaşlık isteklerini getirir.
     */
    @Transactional(readOnly = true)
    public List<FriendshipResponse>
    getSentPendingRequests(
            String senderEmail
    ) {
        User sender =
                findUserByEmail(senderEmail);

        return friendshipRepository
                .findBySenderIdAndStatus(
                        sender.getId(),
                        FriendshipStatus.PENDING
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    /*
     * Giriş yapan kullanıcının kabul edilmiş
     * bütün arkadaşlıklarını getirir.
     *
     * Kullanıcı sender veya receiver olabilir.
     */
    @Transactional(readOnly = true)
    public List<FriendshipResponse> getFriends(
            String userEmail
    ) {
        User user =
                findUserByEmail(userEmail);

        return friendshipRepository
                .findAcceptedFriendshipsByUserId(
                        user.getId()
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    /*
     * Arkadaşlıktan çıkarma işlemi.
     *
     * Arkadaşlığın iki tarafı da bu işlemi yapabilir.
     */
    @Transactional
    public void removeFriend(
            String userEmail,
            Long friendshipId
    ) {
        User currentUser =
                findUserByEmail(userEmail);

        Friendship friendship =
                findFriendshipById(friendshipId);

        boolean currentUserIsSender =
                Objects.equals(
                        friendship
                                .getSender()
                                .getId(),
                        currentUser.getId()
                );

        boolean currentUserIsReceiver =
                Objects.equals(
                        friendship
                                .getReceiver()
                                .getId(),
                        currentUser.getId()
                );

        /*
         * Giriş yapan kullanıcı arkadaşlığın
         * taraflarından biri değilse silemez.
         */
        if (
                !currentUserIsSender &&
                        !currentUserIsReceiver
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bu arkadaşlığı silme yetkin yok."
            );
        }

        /*
         * Sadece kabul edilmiş arkadaşlıklar
         * arkadaşlıktan çıkarılabilir.
         */
        if (
                friendship.getStatus()
                        != FriendshipStatus.ACCEPTED
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bu kayıt kabul edilmiş bir arkadaşlık değil."
            );
        }

        friendshipRepository.delete(friendship);
    }

    /*
     * Email adresine göre kullanıcıyı bulur.
     */
    private User findUserByEmail(
            String email
    ) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kullanıcı bulunamadı."
                        )
                );
    }

    /*
     * ID değerine göre arkadaşlık kaydını bulur.
     */
    private Friendship findFriendshipById(
            Long friendshipId
    ) {
        return friendshipRepository
                .findById(friendshipId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Arkadaşlık isteği bulunamadı."
                        )
                );
    }

    /*
     * İşlemi yapan kullanıcı, isteğin receiver
     * tarafı mı kontrol eder.
     */
    private void verifyRequestReceiver(
            Friendship friendship,
            User currentUser
    ) {
        boolean currentUserIsReceiver =
                Objects.equals(
                        friendship
                                .getReceiver()
                                .getId(),
                        currentUser.getId()
                );

        if (!currentUserIsReceiver) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bu arkadaşlık isteği üzerinde işlem yapma yetkin yok."
            );
        }
    }

    /*
     * Friendship entity nesnesini,
     * frontend'e gönderilecek DTO'ya dönüştürür.
     */
    private FriendshipResponse convertToResponse(
            Friendship friendship
    ) {
        FriendUserResponse senderResponse =
                FriendUserResponse.builder()
                        .id(
                                friendship
                                        .getSender()
                                        .getId()
                        )
                        .name(
                                friendship
                                        .getSender()
                                        .getName()
                        )
                        .build();

        FriendUserResponse receiverResponse =
                FriendUserResponse.builder()
                        .id(
                                friendship
                                        .getReceiver()
                                        .getId()
                        )
                        .name(
                                friendship
                                        .getReceiver()
                                        .getName()
                        )
                        .build();

        return FriendshipResponse.builder()
                .friendshipId(
                        friendship.getId()
                )
                .sender(senderResponse)
                .receiver(receiverResponse)
                .status(
                        friendship.getStatus()
                )
                .createdAt(
                        friendship.getCreatedAt()
                )
                .updatedAt(
                        friendship.getUpdatedAt()
                )
                .build();
    }
}