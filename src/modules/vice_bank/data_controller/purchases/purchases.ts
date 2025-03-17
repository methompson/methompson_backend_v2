import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';
import { Purchase } from '@vice_bank/models/purchase';

class PurchasesDataService extends FileDataService<Purchase> {
  parseData(data: unknown): Purchase {
    return Purchase.fromJSON(data);
  }

  async getPurchasesByUser(userId: string): Promise<Purchase[]> {
    const purchases = Object.values(this._data).filter(
      (purchase) => purchase.userId === userId,
    );

    return purchases;
  }
}

const purchasesService = new PurchasesDataService(
  getBaseFilePath(),
  'purchases',
);
export async function init() {
  await purchasesService.init();
}

export async function getPurchases(userId: string) {
  return purchasesService.getPurchasesByUser(userId);
}

export async function getPurchase(purchaseId: string, userId: string) {
  const purchase = await purchasesService.getDataById(purchaseId);

  if (purchase.userId !== userId) {
    throw new NotFoundError('Purchase Not Found');
  }

  return purchase;
}

export async function addPurchase(purchase: Purchase) {
  return purchasesService.addData({ data: purchase });
}

export async function updatePurchase(purchase: Purchase) {
  return purchasesService.updateData({ data: purchase });
}

export async function deletePurchase(purchaseId: string) {
  return purchasesService.deleteData({ id: purchaseId });
}
export async function clearPurchases() {
  await purchasesService.clearFile();
}
