export const mockedConfigService = {
  get(key: string): string {
    switch (key) {
      case 'JWT_EXPIRATION_TIME':
        return '24h';
    }
  },
};
