import { Resolver, Root, FieldResolver } from 'type-graphql';
import { ProfileRole } from '../entities/Profile';
import { Role } from '../../db/_types';
import rolesList from '../../utils/constants/rolesList';

@Resolver(() => ProfileRole)
export default class {
  @FieldResolver()
  key(@Root() { role }: Role) {
    return role;
  }

  @FieldResolver()
  label(@Root() { role }: Role) {
    const roleDetail = rolesList.find((r) => r.key === role);
    return roleDetail.label;
  }
}
