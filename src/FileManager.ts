import fs from "fs";

export type Options = {
    basePath: string;
};

export class FileManager {
    #basePath: string;
    #network: string;
    #tag: string | undefined;
    #fileName: string;
    #didRead: boolean = false;
    rawData: any;

    constructor(
        fileName: string,
        tag: string | undefined = undefined,
        network: string | undefined = undefined,
        options: Options = {
            basePath: "./settings",
        },
    ) {
        this.#basePath = options.basePath || "./settings";

        if (!network) {
            const hre = require("hardhat");
            this.#network = hre.network.name;
        } else {
            this.#network = network;
        }

        this.#tag = tag;
        this.#fileName = fileName;

        this.#didRead = false;
    }

    get() {
        if (!this.#didRead) {
            this.#readJSON();
        }

        return this.rawData;
    }

    refresh() {
        this.#readJSON();
    }

    listTags() {
        const path = this.#getDirectoryPath();

        return fs
            .readdirSync(path, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    }

    set(key: string, value: string) {
        if (!this.#didRead) {
            this.#readJSON();
        }

        this.rawData[key] = value;
        this.#writeJSON();
    }

    #getPath() {
        return this.#getDirectoryPath() + `/${this.#fileName}.json`;
    }

    #getDirectoryPath() {
        if (this.#tag === undefined) {
            return `./${this.#basePath}/${this.#network}`;
        }

        return `./${this.#basePath}/${this.#network}/${this.#tag}`;
    }

    #readJSON() {
        const path = this.#getPath();

        if (!fs.existsSync(path)) {
            this.#didRead = true;
            this.rawData = {};

            return;
        }

        this.rawData = JSON.parse(fs.readFileSync(path, "utf8"));
        this.#didRead = true;
    }

    #writeJSON() {
        if (!this.#didRead) {
            return;
        }

        this.#ensureDirectoryExistence();

        const data = JSON.stringify(this.rawData, null, 4);

        fs.writeFileSync(this.#getPath(), data, {
            flag: "w",
        });
    }

    #ensureDirectoryExistence() {
        const path = this.#getDirectoryPath();

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }
}
