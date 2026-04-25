package com.campus.hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class HubApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("..")
				.filename(".env")
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		SpringApplication.run(HubApplication.class, args);
	}

}
