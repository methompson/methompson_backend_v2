import { Reward } from '@vice_bank/models/reward';
import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';

class RewardsDataService extends FileDataService<Reward> {
  parseData(data: unknown): Reward {
    return Reward.fromJSON(data);
  }

  async getRewardsByUser(userId: string): Promise<Reward[]> {
    const rewards = Object.values(this._data).filter(
      (reward) => reward.userId === userId,
    );

    return rewards;
  }
}

const rewardsService = new RewardsDataService(getBaseFilePath(), 'rewards');
export async function init() {
  await rewardsService.init();
}

export async function getRewards(userId: string) {
  return rewardsService.getRewardsByUser(userId);
}

export async function getReward(rewardId: string, userId: string) {
  const reward = await rewardsService.getDataById(rewardId);

  if (reward.userId !== userId) {
    throw new NotFoundError('Reward Not Found');
  }

  return reward;
}

export async function addReward(reward: Reward) {
  return rewardsService.addData({ data: reward });
}

export async function updateReward(reward: Reward) {
  return rewardsService.updateData({ data: reward });
}

export async function deleteReward(rewardId: string) {
  return rewardsService.deleteData({ id: rewardId });
}
export async function clearRewards() {
  await rewardsService.clearFile();
}
