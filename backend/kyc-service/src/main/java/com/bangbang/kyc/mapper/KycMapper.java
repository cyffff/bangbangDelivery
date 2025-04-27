package com.bangbang.kyc.mapper;

import com.bangbang.kyc.dto.*;
import com.bangbang.kyc.model.KycDocument;
import com.bangbang.kyc.model.KycVerification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface KycMapper {

    KycMapper INSTANCE = Mappers.getMapper(KycMapper.class);

    // Map KycVerificationRequest to KycVerification
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "verifiedAt", ignore = true)
    @Mapping(target = "verifiedBy", ignore = true)
    @Mapping(target = "expiresAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    KycVerification verificationRequestToEntity(KycVerificationRequest request);

    // Map DocumentRequest to KycDocument
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    KycDocument documentRequestToEntity(DocumentRequest request);

    // Map KycVerification to KycVerificationResponse (without documents)
    KycVerificationResponse verificationToResponse(KycVerification verification);

    // Map KycVerification to KycVerificationResponse (with documents)
    @Mapping(target = "documents", source = "documents")
    KycVerificationResponse verificationToResponseWithDocuments(KycVerification verification, List<DocumentResponse> documents);

    // Map KycDocument to DocumentResponse
    DocumentResponse documentToResponse(KycDocument document);

    // Map a list of KycDocument to a list of DocumentResponse
    List<DocumentResponse> documentsToResponses(List<KycDocument> documents);
} 