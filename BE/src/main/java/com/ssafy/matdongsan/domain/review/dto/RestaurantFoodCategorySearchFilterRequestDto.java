package com.ssafy.matdongsan.domain.review.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RestaurantFoodCategorySearchFilterRequestDto {
    private String name;
}
