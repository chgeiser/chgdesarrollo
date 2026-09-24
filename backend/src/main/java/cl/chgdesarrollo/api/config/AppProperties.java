package cl.chgdesarrollo.api.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Admin admin, Jwt jwt, Uploads uploads, Cors cors) {

    public record Admin(String username, String password) {}

    public record Jwt(String secret, long expirationHours) {}

    public record Uploads(String dir, String publicPath) {}

    public record Cors(List<String> allowedOrigins) {}
}
