export type Stack = "frontend" | "backend";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type Package = FrontendPackage | SharedPackage;

export interface LogPayload {
  stack: Stack;
  level: LogLevel;
  package: Package;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}
