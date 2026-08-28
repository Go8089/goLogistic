import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";

// Logger service - Single Responsibility
class ApiLogger {
  private isDev = import.meta.env.DEV;

  log(message: string, data?: unknown): void {
    if (this.isDev) {
      console.log(`[API] ${message}`, data);
    }
  }

  error(message: string, error?: unknown): void {
    if (this.isDev) {
      console.error(`[API Error] ${message}`, error);
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.isDev) {
      console.warn(`[API Warning] ${message}`, data);
    }
  }
}

// Error handler - Single Responsibility
interface ErrorHandler {
  canHandle(error: AxiosError): boolean;
  handle(error: AxiosError): void;
}

// 401 Unauthorized
class UnauthorizedErrorHandler implements ErrorHandler {
  private logger: ApiLogger;

  constructor(logger: ApiLogger) {
    this.logger = logger;
  }

  canHandle(error: AxiosError): boolean {
    return error.response?.status === 401;
  }

  handle(error: AxiosError): void {
    const status = error.response?.status;

    const responseData = error.response?.data;

    this.logger.error(
      `Handling ${status} unauthorized error`,
      responseData ?? error.message
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const currentPath = window.location.pathname;

    const publicAuthRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/verify-reset-otp",
      "/reset-password",
      "/admin/login",
    ];

    // Only redirect if not already on a public auth route
    if (!publicAuthRoutes.includes(currentPath)) {
      window.dispatchEvent(
        new CustomEvent("auth:unauthorized", {
          detail: {
            status,
            message: this.getErrorMessage(error),
          },
        })
      );

      window.location.href = "/login";
    }
  }

  private getErrorMessage(error: AxiosError): string {
    const data = error.response?.data;

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    return error.message;
  }
}

// 403 Forbidden
class ForbiddenErrorHandler implements ErrorHandler {
  private logger: ApiLogger;

  constructor(logger: ApiLogger) {
    this.logger = logger;
  }

  canHandle(error: AxiosError): boolean {
    return error.response?.status === 403;
  }

  handle(error: AxiosError): void {
    const status = error.response?.status;

    const responseData = error.response?.data;

    this.logger.error(
      `Handling ${status} forbidden error`,
      responseData ?? error.message
    );

    window.dispatchEvent(
      new CustomEvent("auth:forbidden", {
        detail: {
          status,
          message: this.getErrorMessage(error),
        },
      })
    );
  }

  private getErrorMessage(error: AxiosError): string {
    const data = error.response?.data;

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    return error.message;
  }
}

// Dependency Injection
const logger = new ApiLogger();

const errorHandlers: ErrorHandler[] = [
  new UnauthorizedErrorHandler(logger),
  new ForbiddenErrorHandler(logger),
];

// Axios API client
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    logger.log(
      `${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },

  (error) => {
    logger.error(
      "Request error",
      error
    );

    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    logger.log(
      `Response ${response.status} from ${response.config.url}`
    );

    return response;
  },

  (error: AxiosError) => {
    logger.error(
      "Response error",
      error.response?.data ?? error.message
    );

    // Find appropriate error handler
    for (const handler of errorHandlers) {
      if (handler.canHandle(error)) {
        handler.handle(error);
        break;
      }
    }

    return Promise.reject(error);
  }
);

export default api;