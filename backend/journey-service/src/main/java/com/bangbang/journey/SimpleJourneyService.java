import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class SimpleJourneyService {
    static Map<String, Map<String, Object>> journeys = new HashMap<>();

    static {
        // Add mock data
        Map<String, Object> journey1 = new HashMap<>();
        journey1.put("id", "1");
        journey1.put("demandId", "3");
        journey1.put("driverId", "2");
        journey1.put("status", "IN_PROGRESS");
        journey1.put("currentLocation", "40.7348,-73.9915");
        journey1.put("distanceKm", "4.8");
        journey1.put("durationMinutes", "45");
        journey1.put("notes", "Driver is on the way - ETA 15 minutes");
        journeys.put("1", journey1);

        Map<String, Object> journey2 = new HashMap<>();
        journey2.put("id", "2");
        journey2.put("demandId", "1");
        journey2.put("driverId", "3");
        journey2.put("status", "PENDING");
        journey2.put("currentLocation", "40.7128,-74.0060");
        journey2.put("distanceKm", "3.2");
        journey2.put("durationMinutes", "30");
        journey2.put("notes", "Awaiting driver confirmation");
        journeys.put("2", journey2);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Journey Service starting on port 8085...");
        HttpServer server = HttpServer.create(new InetSocketAddress(8085), 0);

        // Health check endpoint
        server.createContext("/actuator/health", new HttpHandler() {
            public void handle(HttpExchange exchange) throws IOException {
                String response = "{\"status\":\"UP\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });

        // Get all journeys
        server.createContext("/api/v1/journeys", new HttpHandler() {
            public void handle(HttpExchange exchange) throws IOException {
                if (exchange.getRequestMethod().equals("GET")) {
                    StringBuilder json = new StringBuilder("[");
                    boolean first = true;
                    for (Map<String, Object> journey : journeys.values()) {
                        if (!first) {
                            json.append(",");
                        }
                        first = false;
                        json.append("{");
                        boolean innerFirst = true;
                        for (Map.Entry<String, Object> entry : journey.entrySet()) {
                            if (!innerFirst) {
                                json.append(",");
                            }
                            innerFirst = false;
                            json.append("\"").append(entry.getKey()).append("\":");
                            json.append("\"").append(entry.getValue()).append("\"");
                        }
                        json.append("}");
                    }
                    json.append("]");
                    String response = json.toString();
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, response.length());
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Journey Service started successfully");
    }
} 