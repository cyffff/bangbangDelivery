import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class SimpleDemandService {
    static Map<String, Map<String, Object>> demands = new HashMap<>();

    static {
        // Add mock data
        Map<String, Object> demand1 = new HashMap<>();
        demand1.put("id", "1");
        demand1.put("userId", "1");
        demand1.put("pickupLocation", "123 Main St, New York, NY");
        demand1.put("dropoffLocation", "456 Broadway, New York, NY");
        demand1.put("status", "PENDING");
        demand1.put("price", "15.99");
        demands.put("1", demand1);

        Map<String, Object> demand2 = new HashMap<>();
        demand2.put("id", "2");
        demand2.put("userId", "2");
        demand2.put("pickupLocation", "789 5th Ave, New York, NY");
        demand2.put("dropoffLocation", "321 Park Ave, New York, NY");
        demand2.put("status", "PENDING");
        demand2.put("price", "12.50");
        demands.put("2", demand2);

        Map<String, Object> demand3 = new HashMap<>();
        demand3.put("id", "3");
        demand3.put("userId", "1");
        demand3.put("pickupLocation", "555 Water St, New York, NY");
        demand3.put("dropoffLocation", "777 Madison Ave, New York, NY");
        demand3.put("status", "ACCEPTED");
        demand3.put("price", "25.75");
        demands.put("3", demand3);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Demand Service starting on port 8084...");
        HttpServer server = HttpServer.create(new InetSocketAddress(8084), 0);

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

        // Get all demands
        server.createContext("/api/v1/demands", new HttpHandler() {
            public void handle(HttpExchange exchange) throws IOException {
                if (exchange.getRequestMethod().equals("GET")) {
                    StringBuilder json = new StringBuilder("[");
                    boolean first = true;
                    for (Map<String, Object> demand : demands.values()) {
                        if (!first) {
                            json.append(",");
                        }
                        first = false;
                        json.append("{");
                        boolean innerFirst = true;
                        for (Map.Entry<String, Object> entry : demand.entrySet()) {
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
        System.out.println("Demand Service started successfully");
    }
} 