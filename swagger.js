const swagger = {
    swagger: "3.0",
    info: {
      description: "This API allows users to create and manage short URLs, including features like custom aliases and rate limiting.",
      version: "1.0.0",
      title: "URL Shortener API",
      contact: {
        email: "piyushchauhan.work@gmail.com",
      },
    },
    schemes: ["https", "http"],
    host: "", // Add your API host, e.g., "localhost:3000" or "api.example.com"
    basePath: "/",
    paths: {
      "/api/shorten": {
        post: {
          summary: "Create a shortened URL",
          description: "Generates a short URL for the provided long URL. Allows optional custom aliases.",
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            {
              in: "body",
              name: "body",
              required: true,
              schema: {
                type: "object",
                required: ["longUrl"],
                properties: {
                  longUrl: {
                    type: "string",
                    description: "The long URL to be shortened",
                  },
                  customAlias: {
                    type: "string",
                    description: "Optional custom alias for the short URL",
                  },
                  topic: {
                    type: "string",
                    description: "Optional topic or category for the URL",
                  },
                },
                example: {
                  longUrl: "https://www.example.com",
                  customAlias: "exampleAlias",
                  topic: "technology",
                },
              },
            },
            {
                in: "header",
                name: "Cookie",
                required: true,
                type: "string",
                description: "Cookie token for authorization",
                example: "connect.sid=s%3ACpp1LO_fWRtZ30B_j44OugHuCkqb-8GY.mQvdJkDXyK2%2F9P6CvL%2FnkmbzzraVLYK9S0Sq%2B9CZLvY",
              },
          ],
          responses: {
            201: {
              description: "Short URL created successfully",
              schema: {
                type: "object",
                properties: {
                  shortUrl: {
                    type: "string",
                    description: "The generated short URL",
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "The creation timestamp",
                  },
                  email: {
                    type: "string",
                    description: "The email of the user who created the short URL",
                  },
                },
                example: {
                  shortUrl: "http://short.ly/exampleAlias",
                  createdAt: "2025-01-22T10:15:30Z",
                  email: "user@example.com",
                },
              },
            },
            400: {
              description: "Invalid URL provided",
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Invalid URL provided",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized access",
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Token expired. Please sign in again.",
                  },
                },
              },
            },
            409: {
              description: "Custom alias conflict",
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Custom alias already in use",
                  },
                },
              },
            },
            429: {
              description: "Too many requests",
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Too many requests",
                  },
                },
              },
            },
          },
        },
      },
      "/api/shorten/{alias}": {
        get: {
          summary: "Redirect to the original URL using the alias",
          description: "Resolves the provided alias to the original URL and redirects to it.",
          produces: ["application/json"],
          parameters: [
            {
              name: "alias",
              in: "path",
              required: true,
              type: "string",
              description: "The alias of the shortened URL",
            },
            {
                in: "header",
                name: "x-forwarded-for",
                required: false,
                type: "string",
                description: "The IP address of the client",
                example: "192.168.0.1",
              },
              {
                in: "header",
                name: "user-agent",
                required: true,
                type: "string",
                description: "The user agent string that the client sends to the server, identifying the client application (browser, version, OS).",
                example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              },
              {
                in: "header",
                name: "sec-ch-ua-mobile",
                required: false,
                type: "string",
                description: "Indicates whether the device is mobile. A value of '?1' means mobile, and '?0' means not mobile.",
                example: "?1",
              },
              {
                in: "header",
                name: "sec-ch-ua-platform",
                required: false,
                type: "string",
                description: "Indicates the platform (OS) of the device making the request (e.g., Windows, macOS, Android).",
                example: "Windows",
              },
          ],
          responses: {
            302: {
              description: "Redirects to the original URL",
              headers: {
                Location: {
                  description: "The original URL",
                  type: "string",
                },
              },
            },
            404: {
              description: "Alias not found",
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Alias not found",
                  },
                },
              },
            },
          },
        },
      },
      "/api/analytics/overall": {
      get: {
        summary: "Get Overall Analytics",
        description:
          "Retrieve overall analytics for all short URLs created by the authenticated user, providing a comprehensive view of their link performance.",
        tags: ["Analytics"],
        parameters: [
            {
              in: "header",
              name: "Cookie",
              required: true,
              type: "string",
              description: "Cookie token for authorization",
              example: "connect.sid=s%3ACpp1LO_fWRtZ30B_j44OugHuCkqb-8GY.mQvdJkDXyK2%2F9P6CvL%2FnkmbzzraVLYK9S0Sq%2B9CZLvY",
            },
          ],
        responses: {
          200: {
            description: "Analytics retrieved successfully",
            schema: {
              type: "object",
              properties: {
                totalUrls: {
                  type: "number",
                  description: "Total number of short URLs created by the user",
                },
                totalClicks: {
                  type: "number",
                  description: "Total number of clicks across all URLs created by the user",
                },
                uniqueUsers: {
                  type: "number",
                  description: "Total number of unique users who accessed any of the user's short URLs",
                },
                clicksByDate: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: {
                        type: "string",
                        format: "date",
                        description: "The date of the recorded clicks",
                      },
                      totalClicks: {
                        type: "number",
                        description: "Total clicks recorded on this date",
                      },
                    },
                  },
                },
                osType: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      osName: {
                        type: "string",
                        description: "The name of the operating system (e.g., Windows, macOS)",
                      },
                      uniqueClicks: {
                        type: "number",
                        description: "Number of unique clicks for that OS",
                      },
                      uniqueUsers: {
                        type: "number",
                        description: "Number of unique users for that OS",
                      },
                    },
                  },
                },
                deviceType: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      deviceName: {
                        type: "string",
                        description: "The type of device used (e.g., mobile, desktop)",
                      },
                      uniqueClicks: {
                        type: "number",
                        description: "Number of unique clicks for that device type",
                      },
                      uniqueUsers: {
                        type: "number",
                        description: "Number of unique users for that device type",
                      },
                    },
                  },
                },
              },
              example: {
                totalUrls: 45,
                totalClicks: 1500,
                uniqueUsers: 850,
                clicksByDate: [
                  { date: "2025-01-20", totalClicks: 300 },
                  { date: "2025-01-21", totalClicks: 250 },
                ],
                osType: [
                  { osName: "Windows", uniqueClicks: 800, uniqueUsers: 400 },
                  { osName: "iOS", uniqueClicks: 400, uniqueUsers: 300 },
                ],
                deviceType: [
                  { deviceName: "Mobile", uniqueClicks: 1000, uniqueUsers: 600 },
                  { deviceName: "Desktop", uniqueClicks: 500, uniqueUsers: 250 },
                ],
              },
            },
          },
          401: {
            description: "Unauthorized access",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Token expired. Please sign in again.",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Internal server error",
                },
              },
            },
          },
        },
      },
    },
    "/analytics/{alias}": {
        get: {
          tags: ["Analytics"],
          summary: "Get detailed analytics for a specific short URL.",
          description:
            "Retrieve insights into the performance of a specific short URL, including total clicks, unique audience interactions, OS types, and device types.",
          parameters: [
            {
              name: "alias",
              in: "path",
              required: true,
              type: "string",
              description: "The alias of the short URL to retrieve analytics for."
            },
            {
              name: "Cookie",
              in: "header",
              required: true,
              type: "string",
              description: "Cookie token for user authorization.",
              example:
                "connect.sid=s%3ACpp1LO_fWRtZ30B_j44OugHuCkqb-8GY.mQvdJkDXyK2%2F9P6CvL%2FnkmbzzraVLYK9S0Sq%2B9CZLvY"
            }
          ],
          responses: {
            200: {
              description: "Detailed analytics for the specified short URL.",
              schema: {
                type: "object",
                properties: {
                  totalClicks: { type: "number", description: "Total clicks on the short URL." },
                  uniqueUsers: { type: "number", description: "Number of unique users." },
                  clicksByDate: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", format: "date", description: "Date of the click." },
                        count: { type: "number", description: "Click count on this date." }
                      }
                    }
                  },
                  osType: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        osName: { type: "string", description: "Operating system name." },
                        uniqueClicks: { type: "number", description: "Unique clicks for this OS." },
                        uniqueUsers: { type: "number", description: "Unique users for this OS." }
                      }
                    }
                  },
                  deviceType: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        deviceName: { type: "string", description: "Device type (e.g., mobile, desktop)." },
                        uniqueClicks: { type: "number", description: "Unique clicks for this device type." },
                        uniqueUsers: { type: "number", description: "Unique users for this device type." }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized access.",
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Token Expired plz Sign in again" }
                }
              }
            },
            404: {
              description: "Short URL not found.",
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Short URL not found" }
                }
              }
            },
            500: {
              description: "Internal server error.",
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" }
                }
              }
            }
          }
        }
      },
    "/api/analytics/topic/{topic}": {
      get: {
        summary: "Get Topic-Based Analytics",
        description: "Retrieve analytics for all short URLs grouped under a specific topic, allowing users to assess the performance of their links based on categories.",
        tags: ["Analytics"],
        parameters: [
          {
            in: "path",
            name: "topic",
            required: true,
            type: "string",
            description: "The topic for which analytics is to be retrieved. Valid topics: acquisition, activation, retention, unknown.",
            example: "acquisition", // Example topic value
          },
          {
            in: "header",
            name: "Cookie",
            required: true,
            type: "string",
            description: "Cookie token for authorization",
            example: "connect.sid=s%3ACpp1LO_fWRtZ30B_j44OugHuCkqb-8GY.mQvdJkDXyK2%2F9P6CvL%2FnkmbzzraVLYK9S0Sq%2B9CZLvY",
          },
        ],
        responses: {
          200: {
            description: "Analytics data retrieved successfully",
            schema: {
              type: "object",
              properties: {
                totalClicks: {
                  type: "number",
                  description: "Total number of clicks across all URLs in the specified topic",
                },
                uniqueUsers: {
                  type: "number",
                  description: "Number of unique users who accessed URLs in the specified topic",
                },
                clicksByDate: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: {
                        type: "string",
                        format: "date",
                        description: "The date of the recorded clicks",
                      },
                      clickCount: {
                        type: "number",
                        description: "Total clicks recorded for the given date",
                      },
                    },
                  },
                },
                urls: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      shortUrl: {
                        type: "string",
                        description: "The generated short URL",
                      },
                      totalClicks: {
                        type: "number",
                        description: "Total number of clicks for the short URL",
                      },
                      uniqueUsers: {
                        type: "number",
                        description: "Number of unique users who accessed the short URL",
                      },
                    },
                  },
                },
              },
              example: {
                totalClicks: 2000,
                uniqueUsers: 1200,
                clicksByDate: [
                  { date: "2025-01-18", clickCount: 300 },
                  { date: "2025-01-19", clickCount: 350 },
                  { date: "2025-01-20", clickCount: 400 },
                ],
                urls: [
                  { shortUrl: "shorturl1", totalClicks: 1000, uniqueUsers: 600 },
                  { shortUrl: "shorturl2", totalClicks: 500, uniqueUsers: 300 },
                  { shortUrl: "shorturl3", totalClicks: 500, uniqueUsers: 300 },
                ],
              },
            },
          },
          400: {
            description: "Invalid topic provided",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Invalid topic provided",
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Token expired or invalid",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Token Expired. Please sign in again.",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Internal server error",
                },
              },
            },
          },
        },
      },
    },

    },
  };
  
  module.exports = swagger;
  