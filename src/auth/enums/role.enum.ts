import { registerEnumType } from '@nestjs/graphql';

enum Role {
  User = 'User',
  Admin = 'Admin',
}
export default Role;

registerEnumType(Role, { name: 'Role', description: 'User role' });
