import { MAccount } from '../../mods/base/db/index.js';
import hashPassword from '../../mods/base/utils/hashPassword.js';

export default async function loadInitialData(): Promise<void> {
  const adminPwHash = await hashPassword('admin123');
  const adminEmail = 'admin@techhustlers.ph';

  const adminAccount = {
    email: adminEmail,
    firstName: 'Tony',
    lastName: 'Guzman',
    name: 'Tony Guzman',
    isAdmin: true,
    isVerified: true,
    password: adminPwHash,
    lastSeenAt: new Date(),
  };

  const adminAccountDoc = await MAccount.findOne({ email: adminEmail });
  if (!adminAccountDoc) {
    await new MAccount(adminAccount).save();
  }
}
