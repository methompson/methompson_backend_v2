import { FileHandle, mkdir, open } from 'fs/promises';
import { join } from 'path';
import { isArray } from 'tcheck';

import { arrayToObject } from '@/utils/array_to_obj';
import {
  ItemAlreadyExistsError,
  ItemDoesNotExistError,
  NotFoundError,
} from '@/utils/errors';

export function getBaseFilePath() {
  // TODO env variable
  return './data';
}

interface WriteDataToFilePayload {
  path: string;
  filename: string;
  content: string;
}

type Identifiable = {
  id: string;
};

interface AddDataPayload<T extends Identifiable> {
  data: T;
  upsert?: boolean;
}

interface UpdateDataPayload<T extends Identifiable> {
  data: T;
  upsert?: boolean;
}

interface DeleteDataPayload {
  id: string;
}

export abstract class FileDataService<T extends Identifiable> {
  protected _data: Record<string, T> = {};

  constructor(
    protected filePath: string,
    protected baseFilename: string,
  ) {}

  get dataString(): string {
    return JSON.stringify(Object.values(this._data));
  }

  get data() {
    return { ...this._data };
  }

  get dataList() {
    return Object.values(this._data);
  }

  get filename() {
    return `${this.baseFilename}.json`;
  }

  async writeDataToFile(payload: WriteDataToFilePayload) {
    const fileHandle = await this.makeFileHandle(
      payload.path,
      payload.filename,
    );

    await fileHandle.truncate(0);
    await fileHandle.write(payload.content, 0);

    await fileHandle.close();
  }

  async writeCurrentDataToFile() {
    await this.writeDataToFile({
      path: this.filePath,
      filename: `${this.baseFilename}.json`,
      content: this.dataString,
    });
  }

  async makeFileHandle(filePath: string, name?: string): Promise<FileHandle> {
    await mkdir(filePath, { recursive: true });
    const filename = name ?? this.filename;
    const filepath = join(filePath, filename);

    const fileHandle = await open(filepath, 'a+');

    return fileHandle;
  }

  async readFile(path: string): Promise<string> {
    const fileHandle = await this.makeFileHandle(path);
    const buffer = await fileHandle.readFile();

    await fileHandle.close();

    return buffer.toString();
  }

  async getDataById(id: string): Promise<T> {
    const dat = this._data[id];

    if (!dat) {
      throw new NotFoundError('Data not found');
    }

    return dat;
  }

  async addData(payload: AddDataPayload<T>): Promise<T | undefined> {
    const oldDat = this._data[payload.data.id];

    if (oldDat && payload.upsert !== true) {
      throw new ItemAlreadyExistsError('Data already exists');
    }

    this._data[payload.data.id] = payload.data;

    await this.writeCurrentDataToFile();

    return oldDat;
  }

  async updateData(payload: UpdateDataPayload<T>): Promise<T> {
    const oldDat = this._data[payload.data.id];

    if (!oldDat && payload.upsert !== true) {
      throw new ItemDoesNotExistError('Data not found');
    }

    this._data[payload.data.id] = payload.data;

    await this.writeCurrentDataToFile();

    return oldDat ?? payload.data;
  }

  async deleteData(payload: DeleteDataPayload): Promise<T> {
    const oldDat = this._data[payload.id];

    if (!oldDat) {
      throw new NotFoundError('Data not found');
    }

    delete this._data[payload.id];

    await this.writeCurrentDataToFile();

    return oldDat;
  }

  async init() {
    const dataStr = await this.readFile(this.filePath);

    try {
      const rawData = JSON.parse(dataStr);

      if (!isArray(rawData)) {
        throw new Error('Data is not an array');
      }

      const actions: T[] = [];
      for (const dat of rawData) {
        const action = this.parseData(dat);
        actions.push(action);
      }

      this._data = arrayToObject(actions, (a) => a.id);
    } catch (e) {
      console.error('Error parsing data', e);

      await this.clearFile();
    }
  }

  async clearFile() {
    const fileHandle = await this.makeFileHandle(this.filePath, this.filename);
    await fileHandle.truncate(0);
    await fileHandle.write('[]', 0);
    await fileHandle.close();
  }

  abstract parseData(data: unknown): T;
}
