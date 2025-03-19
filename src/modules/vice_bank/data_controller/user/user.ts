import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';
import { ViceBankUser } from '@vice_bank/models/vice_bank_user';

class ViceBankUsersDataService extends FileDataService<ViceBankUser> {
  parseData(data: unknown): ViceBankUser {
    return ViceBankUser.fromJSON(data);
  }

  async getViceBankUsersByUser(userId: string): Promise<ViceBankUser[]> {
    const viceBankUsers = Object.values(this._data).filter(
      (viceBankUser) => viceBankUser.userId === userId,
    );

    return viceBankUsers;
  }

  // We're checking that the Vicebank User ID and User ID both match
  async deleteViceBankUserById(userId: string, viceBankUserId: string) {
    const oldDat = this._data[viceBankUserId];

    if (!oldDat) {
      throw new NotFoundError('Data not found');
    }

    if (oldDat.userId !== userId) {
      throw new NotFoundError('Data not found');
    }

    delete this._data[viceBankUserId];

    await this.writeCurrentDataToFile();

    return oldDat;
  }
}

const viceBankUsersService = new ViceBankUsersDataService(
  getBaseFilePath(),
  'viceBankUsers',
);
export async function init() {
  await viceBankUsersService.init();
}

export async function getViceBankUsers(userId: string) {
  return viceBankUsersService.getViceBankUsersByUser(userId);
}

export async function getViceBankUser(viceBankUserId: string, userId: string) {
  const viceBankUser = await viceBankUsersService.getDataById(viceBankUserId);

  if (viceBankUser.userId !== userId) {
    throw new NotFoundError('ViceBankUser Not Found');
  }

  return viceBankUser;
}

export async function addViceBankUser(viceBankUser: ViceBankUser) {
  return viceBankUsersService.addData({ data: viceBankUser });
}

export async function updateViceBankUser(viceBankUser: ViceBankUser) {
  return viceBankUsersService.updateData({ data: viceBankUser });
}

export async function deleteViceBankUser(
  userId: string,
  viceBankUserId: string,
) {
  return viceBankUsersService.deleteViceBankUserById(userId, viceBankUserId);
}

export async function clearViceBankUsers() {
  await viceBankUsersService.clearFile();
}
