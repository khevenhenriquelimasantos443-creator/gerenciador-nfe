// O runtime de scripts do Bedrock tem console (vai para o log de conteúdo), mas não é DOM nem Node.
declare const console: {
  log(...dados: unknown[]): void;
  warn(...dados: unknown[]): void;
  error(...dados: unknown[]): void;
};
