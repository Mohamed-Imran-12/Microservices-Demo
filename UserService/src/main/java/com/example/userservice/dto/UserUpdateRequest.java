package com.example.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {

    @Positive(message = "Invalid id")
    @NotNull(message = "Id must not be empty")
    private Long id;

    @NotBlank(message = "Name must not be empty")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be empty")
    private String email;

    @NotBlank(message = "City must not be empty")
    private String city;

    @NotBlank(message = "Phone mus not be empty")
    private String phone;

}
