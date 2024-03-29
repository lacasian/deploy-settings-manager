import {ethers} from "ethers";

export class SettingsReader {
    #data: Record<string, any> = {};

    constructor(data: Record<string, any>) {
        this.#data = data;
    }

    mustGet(key: string) {
        const value = this.get(key);

        if (!value) {
            throw new Error(`Value for ${key} not found`);
        }

        return value;
    }

    mustGetAddress(key: string) {
        const value = this.mustGet(key);

        if (!ethers.isAddress(value)) {
            throw new Error(`Value for ${key} is not a valid address`);
        }

        return value;
    }

    get(key: string, defaultValue: any = undefined) {
        const value = this.#data[key];
        if (!value) {
            return defaultValue;
        }

        return value;
    }

    getReader(key: string, defaultValue: any = undefined) {
        return new SettingsReader(this.get(key, defaultValue));
    }

    mustGetReader(key: string) {
        return new SettingsReader(this.mustGet(key));
    }
}
