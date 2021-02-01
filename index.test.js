const { rest } = require("msw");
const { setupServer } = require("msw/node");
const fetch = require("isomorphic-unfetch");
const axios = require("axios");

const server = setupServer(
  rest.get("http://api.mock/exists", (req, res, ctx) => {
    return res(ctx.json("foobar"));
  })
);

const fetcher = (url) => fetch(url).then((r) => r.json());

describe("my tests", () => {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: "error",
    })
  );
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should allow you to fetch data", async () => {
    const data = await fetcher("http://api.mock/exists");
    expect(data).toBe("foobar");
  });

  it("should throw a MSW error with fetch", async () => {
    try {
      await fetcher("http://api.mock/does-not-exist");
    } catch (error) {
      expect(error.message).toMatch(/MSW/);
    }
  });

  it("should throw a MSW error with axios", async () => {
    try {
      await axios.get("http://api.mock/does-not-exist");
    } catch (error) {
      expect(error.message).toMatch(/MSW/);
    }
  });
});
