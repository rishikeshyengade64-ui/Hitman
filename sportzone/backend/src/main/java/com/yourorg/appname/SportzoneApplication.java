package com.yourorg.appname;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class SportzoneApplication {

    private static final Logger log = LoggerFactory.getLogger(SportzoneApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SportzoneApplication.class, args);
    }

    @EventListener(WebServerInitializedEvent.class)
    public void onWebServerReady(WebServerInitializedEvent event) {
        int port = event.getWebServer().getPort();
        log.info("==================================================================");
        log.info("🚀 SportZone Web Server is READY and LISTENING on port: {}", port);
        log.info("🌐 Bound to network: 0.0.0.0:{}", port);
        log.info("🩺 Health Check Endpoint: http://0.0.0.0:{}/health", port);
        log.info("==================================================================");
    }
}
