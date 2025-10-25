const request = require("supertest");
const { app, server } = require("./server"); // Assuming you export app and server

describe("Server Endpoints", () => {
  // Close the server after all tests are done to prevent hanging
  afterAll((done) => {
    server.close(done);
  });

  it("should respond with a 200 status for the root path", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  describe("POST /api/chat", () => {
    it("should return 400 if 'contents' is missing", async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          // Missing 'contents'
          systemInstruction: { parts: [{ text: "You are a bot." }] },
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Missing 'contents' in request body"
      );
    });

    it("should return 200 and data on a successful API call", async () => {
      // 1. Mock the global fetch function
      const mockApiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "This is a mocked AI response." }],
            },
          },
        ],
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      // 2. Send a valid request to your endpoint
      const response = await request(app)
        .post("/api/chat")
        .send({
          contents: [{ role: "user", parts: [{ text: "Hello" }] }],
        });

      // 3. Assert the response is correct
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockApiResponse);
    });

    it("should retry with the next API key if the first one fails", async () => {
      // 1. Mock the global fetch function to fail once, then succeed
      const mockSuccessResponse = {
        candidates: [
          { content: { parts: [{ text: "Success on second try." }] } },
        ],
      };

      // Ensure we have at least two keys for this test in the .env file
      // e.g., GEMINI_API_KEYS="FAIL_KEY,SUCCESS_KEY"
      const fetchSpy = jest.spyOn(global, "fetch");

      // First call fails (e.g., rate limit, invalid key)
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: jest.fn().mockResolvedValue({ error: "Rate limit exceeded" }),
      });

      // Second call succeeds
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      });

      // 2. Send a valid request
      const response = await request(app)
        .post("/api/chat")
        .send({
          contents: [{ role: "user", parts: [{ text: "Test retry" }] }],
        });

      // 3. Assert the final response is successful
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockSuccessResponse);
      // Verify that fetch was called twice, proving the retry logic worked
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });
});
