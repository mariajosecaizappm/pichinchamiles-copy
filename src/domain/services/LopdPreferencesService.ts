export default class LopdPreferencesService {
    private static readonly prefix = "lopdReminder";

    private static storageKey(identificationNumber: string): string {
        return `${this.prefix}-${identificationNumber}`;
    }

    static async skipLopd(
        identificationNumber: string,
        expiresInSeconds: number,
    ): Promise<void> {
        if (typeof window === 'undefined') return;

        const expirationTime = Date.now() + (expiresInSeconds * 1000);
        sessionStorage.setItem(this.storageKey(identificationNumber), expirationTime.toString());
    }

    static async isSkippedLopd(identificationNumber: string): Promise<boolean> {
        if (typeof window === 'undefined') return false;

        try {
            const storedValue = sessionStorage.getItem(this.storageKey(identificationNumber));

            if (!storedValue) {
                return false;
            }

            const expirationTime = Number.parseInt(storedValue, 10);
            if (Number.isNaN(expirationTime)) {
                return false;
            }

            return Date.now() < expirationTime;
        } catch {
            return false;
        }
    }

    static clearPreferences(): void {
        sessionStorage.clear();
    }
}
