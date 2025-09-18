// Structured logging utility for production-ready error handling

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private logLevel: LogLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // In production, you would send this to your logging service
    // (e.g., DataDog, LogRocket, Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to external logging service
      console.log(JSON.stringify(entry));
    } else {
      // Development logging with colors
      const colors = {
        [LogLevel.DEBUG]: '\x1b[36m', // Cyan
        [LogLevel.INFO]: '\x1b[32m',  // Green
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.ERROR]: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      const levelName = LogLevel[level];
      
      console.log(
        `${colors[level]}[${levelName}]${reset} ${entry.timestamp} - ${message}`,
        context ? `\nContext:` : '',
        context ? JSON.stringify(context, null, 2) : '',
        error ? `\nError:` : '',
        error ? error.stack : ''
      );
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

export const logger = new Logger();
