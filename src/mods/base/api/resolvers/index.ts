import Mutation from './Mutation';
import Query from './Query';
import Image from './Image';
import UserRole from './UserRole';

export default [...Query, ...Mutation, UserRole, Image];
