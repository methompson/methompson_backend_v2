import { FileHandle, mkdir, open } from 'fs/promises';
import { join } from 'path';

export function getBaseFilePath() {
  // TODO env variable
  return './data';
}

interface WriteDataToFilePayload {
  path: string;
  filename: string;
  content: string;
}

export class FileDataService {
  constructor(
    protected filePath: string,
    protected baseFilename: string,
  ) {}

  get filename() {
    return `${this.baseFilename}.json`;
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

  async writeDataToFile(payload: WriteDataToFilePayload) {
    const fileHandle = await this.makeFileHandle(
      payload.path,
      payload.filename,
    );

    await fileHandle.truncate(0);
    await fileHandle.write(payload.content, 0);

    await fileHandle.close();
  }

  async clearFile(filePath: string) {
    const fileHandle = await this.makeFileHandle(filePath, this.filename);
    await fileHandle.truncate(0);
    await fileHandle.write('[]', 0);
    await fileHandle.close();
  }
}
