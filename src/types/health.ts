export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export interface HealthData {
  status: string
  timestamp: string
  environment: Environment
}
