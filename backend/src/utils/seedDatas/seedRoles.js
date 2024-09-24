import Role from '../../models/Role.js';

const seedRoles = async () => {
  const roles = [
    {
      name: 'Admin',
      permissions: ['create', 'read', 'update', 'delete']
    },
    {
      name: 'User',
      permissions: ['read, create, update']
    }

  ];

  for (const role of roles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      await Role.create(role);
    }
  }
};

export default seedRoles;
