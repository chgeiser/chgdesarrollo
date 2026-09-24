package cl.chgdesarrollo.api.auth;

import cl.chgdesarrollo.api.config.AppProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    public record LoginResponse(String token, String username, Instant expiresAt) {}

    private final AuthenticationManager authManager;
    private final JwtEncoder jwtEncoder;
    private final AppProperties props;

    public AuthController(AuthenticationManager authManager, JwtEncoder jwtEncoder, AppProperties props) {
        this.authManager = authManager;
        this.jwtEncoder = jwtEncoder;
        this.props = props;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        }
        Instant now = Instant.now();
        Instant expiresAt = now.plus(props.jwt().expirationHours(), ChronoUnit.HOURS);
        var claims = JwtClaimsSet.builder()
            .issuer("chgdesarrollo")
            .subject(request.username())
            .issuedAt(now)
            .expiresAt(expiresAt)
            .claim("scope", "admin")
            .build();
        var header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new LoginResponse(token, request.username(), expiresAt);
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("username", jwt.getSubject(), "expiresAt", jwt.getExpiresAt());
    }
}
