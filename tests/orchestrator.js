import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    // ensure the server is ready through GET status endpoint.
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (error, attempt) =>
        console.log(
          `Attempt ${attempt} - Failed to fetch status page: ${error.message}`,
        ),
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/statuss");

      if (response.status !== 200) {
        throw new Error(`HTTP error ${response.status}`);
      }
    }
  }
}

export default { waitForAllServices };
