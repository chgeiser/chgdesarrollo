package cl.chgdesarrollo.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ChgApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChgApiApplication.class, args);
    }
}
