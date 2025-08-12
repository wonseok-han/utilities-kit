declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
    readonly NEXT_PUBLIC_API_BASE_URL: string;
  }
}
