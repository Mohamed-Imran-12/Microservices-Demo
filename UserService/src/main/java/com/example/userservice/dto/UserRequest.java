package com.example.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    @NotBlank(message = "Name must not be empty")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be empty")
    private String email;

    @NotNull(message = "Password can't be null")
    @Size(min = 6 ,max = 16 ,message = "Password at least has 6 chars and at most 16 chars")
    private String password;

    @NotBlank(message = "City must not be empty")
    private String city;

    @NotBlank(message = "Phone mus not be empty")
    private String phone;
}
