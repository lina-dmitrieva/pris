const users = [];

module.exports = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id)
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: `${users.length + 1}`, name, email };
      users.push(user);
      return user;
    },
    updateUser: (_, { id, name, email }) => {
      const user = users.find(u => u.id === id);
      if (!user) return null;
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      return user;
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    }
  }
};
