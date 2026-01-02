class Validator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email wajib diisi";
    if (!emailRegex.test(email)) return "Format email tidak valid";
    return null;
  }

  static validatePassword(password) {
    if (!password) return "Password wajib diisi";
    if (password.length < 6) return "Password minimal 6 karakter";
    return null;
  }

  static validateName(name) {
    if (!name) return "Nama wajib diisi";
    if (name.length < 2) return "Nama minimal 2 karakter";
    return null;
  }

  static validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return "Konfirmasi password wajib diisi";
    if (password !== confirmPassword) return "Konfirmasi password tidak cocok";
    return null;
  }
}
