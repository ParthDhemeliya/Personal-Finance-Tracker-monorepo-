declare namespace NodeJS {
  interface ErrnoException extends Error {
    code?: string;
    errno?: number;
    syscall?: string;
    path?: string;
    address?: string;
    port?: number;
  }
}
