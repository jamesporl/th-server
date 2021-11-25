import config from 'core/config';
import { Resolver, Root, FieldResolver } from 'type-graphql';
import { Image as DbImage } from '../../db/_types';
import Image from '../entities/Image';

@Resolver(() => Image)
export default class {
  @FieldResolver()
  thumbnail(@Root() { thumbnail: tnKey }: DbImage) {
    if (tnKey) {
      return `${config.DO_SPACES_URL}/${tnKey}`;
    }
    return null;
  }

  @FieldResolver()
  medium(@Root() { medium: mdKey }: DbImage) {
    if (mdKey) {
      return `${config.DO_SPACES_URL}/${mdKey}`;
    }
    return null;
  }

  @FieldResolver()
  large(@Root() { large: lgKey }: DbImage) {
    if (lgKey) {
      return `${config.DO_SPACES_URL}/${lgKey}`;
    }
    return null;
  }
}
