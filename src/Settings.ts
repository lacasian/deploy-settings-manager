import { SettingsReader } from "./SettingsReader";
import { FileManager, Options } from "./FileManager";

export class Settings {
    #fileName: string;
    #tag: string | undefined;
    #options: Options;

    #fm: FileManager;
    #reader: SettingsReader;

    constructor(
        fileName: string = "settings",
        tag: string | undefined = undefined,
        options: Options = {
            basePath: "./settings",
        },
    ) {
        if (!fileName) {
            throw new Error("fileName is required");
        }

        this.#fileName = fileName;
        this.#tag = tag;
        this.#options = options;

        this.#fm = new FileManager(fileName, tag, options);
        this.#reader = new SettingsReader(this.#fm.get());
    }

    /// ---- initialization ----

    static tag(value: string) {
        return new Settings("settings", value);
    }

    tag(value: string) {
        return new Settings(this.#fileName, value, this.#options);
    }

    static file(value: string) {
        return new Settings(value);
    }

    file(value: string) {
        return new Settings(value, this.#tag, this.#options);
    }

    /// ---- Settings only functions ----
    // note: we don't allow `set` on reader because there's no way to propagate the
    // changes to the original data tree and back on disk without a lot of complexity

    set(key: string, value: string) {
        this.#fm.set(key, value);
        this.#reader = new SettingsReader(this.#fm.get());
    }

    refresh() {
        this.#fm.refresh();
        this.#reader = new SettingsReader(this.#fm.get());
    }

    static listTags() {
        return new Settings().listTags();
    }

    listTags() {
        return this.#fm.listTags();
    }

    /// ---- pass through to SettingsReader ----
    // todo: is there any better way?
    // inheritance not fitting as super() must be called before
    // the FileManager is initialized, and having a public function that allows
    // settings the data defeats the purpose

    mustGet(key: string) {
        return this.#reader.mustGet(key);
    }

    get(key: string, defaultValue: any = undefined) {
        return this.#reader.get(key, defaultValue);
    }

    getReader(key: string, defaultValue: any = undefined) {
        return this.#reader.getReader(key, defaultValue);
    }

    mustGetReader(key: string) {
        return this.#reader.mustGetReader(key);
    }

    mustGetAddress(key: string) {
        return this.#reader.mustGetAddress(key);
    }
}
