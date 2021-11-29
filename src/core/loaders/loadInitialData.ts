import { Types } from 'mongoose';
import { MAccount, MUser } from 'mods/base/db';
import hashPassword from 'mods/base/utils/hashPassword';
import { RoleKey } from 'mods/base/api/entities/_enums';

export default async function loadInitialData(): Promise<void> {
  const adminUserId = new Types.ObjectId();
  const adminPwHash = await hashPassword('admin123');
  const adminEmail = 'admin@techhustlers.ph';

  const adminUser = {
    _id: adminUserId,
    email: adminEmail,
    password: adminPwHash,
    roles: [{ role: RoleKey.staff }],
  };

  const adminPartner = {
    email: adminEmail,
    firstName: 'Tony',
    lastName: 'Guzman',
    userId: adminUserId,
  };

  const adminUserDoc = await MUser.findOne({ email: adminEmail });
  if (!adminUserDoc) {
    await new MUser(adminUser).save();
    await new MAccount(adminPartner).save();
  }
}
