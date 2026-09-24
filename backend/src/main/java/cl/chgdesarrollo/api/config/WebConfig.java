package cl.chgdesarrollo.api.config;

import java.nio.file.Path;
import java.time.Duration;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AppProperties props;

    public WebConfig(AppProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(props.uploads().dir()).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler(props.uploads().publicPath() + "/**")
            .addResourceLocations(location)
            .setCacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic());
    }
}
