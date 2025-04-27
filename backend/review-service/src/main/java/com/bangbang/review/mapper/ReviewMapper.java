package com.bangbang.review.mapper;

import com.bangbang.review.dto.ReviewRequest;
import com.bangbang.review.dto.ReviewResponse;
import com.bangbang.review.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reviewerName", ignore = true)
    @Mapping(target = "isApproved", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isPublic", expression = "java(request.getIsPublic() != null ? request.getIsPublic() : true)")
    Review reviewRequestToReview(ReviewRequest request);

    @Mapping(target = "targetName", ignore = true)
    ReviewResponse reviewToReviewResponse(Review review);
    
    @Mapping(target = "targetName", source = "targetName")
    ReviewResponse reviewToReviewResponse(Review review, String targetName);
} 