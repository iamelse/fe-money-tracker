export const setupAuthRefreshListener = () => {
    window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === 'authToken' && !event.newValue) {
        window.location.reload();
      }
    });
};