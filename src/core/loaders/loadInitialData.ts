import { MAccount } from 'mods/base/db';
import hashPassword from 'mods/base/utils/hashPassword';

export default async function loadInitialData(): Promise<void> {
  const adminPwHash = await hashPassword('admin123');
  const adminEmail = 'admin@techhustlers.ph';

  const adminPartner = {
    email: adminEmail,
    firstName: 'Tony',
    lastName: 'Guzman',
    name: 'Tony Guzman',
    isAdmin: true,
    isVerified: true,
    password: adminPwHash,
  };

  const adminAccountDoc = await MAccount.findOne({ email: adminEmail });
  if (!adminAccountDoc) {
    await new MAccount(adminPartner).save();
  }
}
