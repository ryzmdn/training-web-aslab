class UserManager {
  constructor() {
    this.storageKey = "loginApp_users";
    this.currentUserKey = "loginApp_currentUser";
    this.cleanupOldAccounts();
  }

  getUsers() {
    const users = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    return users;
  }

  saveUsers(users) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  getCurrentUser() {
    const email = localStorage.getItem(this.currentUserKey);
    if (email) {
      const users = this.getUsers();
      return users.find((user) => user.email === email);
    }
    return null;
  }

  setCurrentUser(email) {
    localStorage.setItem(this.currentUserKey, email);
  }

  clearCurrentUser() {
    localStorage.removeItem(this.currentUserKey);
  }

  isEmailExists(email, excludeEmail = null) {
    const users = this.getUsers();
    return users.some(
      (user) => user.email === email && user.email !== excludeEmail
    );
  }

  register(userData) {
    if (this.isEmailExists(userData.email)) {
      throw new Error("Email sudah terdaftar");
    }

    const users = this.getUsers();
    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  login(email, password) {
    const users = this.getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Email tidak terdaftar");
    }

    if (user.password !== password) {
      throw new Error("Password salah");
    }

    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);
    this.setCurrentUser(email);

    return user;
  }

  updateUser(email, updateData) {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      throw new Error("User tidak ditemukan");
    }

    if (updateData.email && updateData.email !== email) {
      if (this.isEmailExists(updateData.email, email)) {
        throw new Error("Email sudah digunakan oleh akun lain");
      }
    }

    users[userIndex] = { ...users[userIndex], ...updateData };
    this.saveUsers(users);

    if (updateData.email && updateData.email !== email) {
      this.setCurrentUser(updateData.email);
    }

    return users[userIndex];
  }

  deleteUser(email) {
    const users = this.getUsers();
    const filteredUsers = users.filter((u) => u.email !== email);
    this.saveUsers(filteredUsers);
    this.clearCurrentUser();
  }

  cleanupOldAccounts() {
    const users = this.getUsers();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = users.filter((user) => {
      const createdDate = new Date(user.createdAt);
      const lastLoginDate = user.lastLogin
        ? new Date(user.lastLogin)
        : createdDate;

      return lastLoginDate > sevenDaysAgo || createdDate > sevenDaysAgo;
    });

    if (activeUsers.length !== users.length) {
      this.saveUsers(activeUsers);
      console.log(
        `Cleaned up ${users.length - activeUsers.length} inactive accounts`
      );
    }
  }
}
