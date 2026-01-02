const router = new Router();
const userManager = new UserManager();

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  document.getElementById("login-email-error").textContent = "";
  document.getElementById("login-password-error").textContent = "";

  const emailError = Validator.validateEmail(email);
  const passwordError = Validator.validatePassword(password);

  if (emailError) {
    document.getElementById("login-email-error").textContent = emailError;
    return;
  }

  if (passwordError) {
    document.getElementById("login-password-error").textContent = passwordError;
    return;
  }

  try {
    userManager.login(email, password);
    alert("Login berhasil!");
    router.navigate("dashboard");
  } catch (error) {
    alert("Login gagal: " + error.message);
  }
});

document
  .getElementById("register-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    document
      .querySelectorAll("#register-page .error")
      .forEach((el) => (el.textContent = ""));

    const nameError = Validator.validateName(name);
    const emailError = Validator.validateEmail(email);
    const passwordError = Validator.validatePassword(password);
    const confirmPasswordError = Validator.validateConfirmPassword(
      password,
      confirmPassword
    );

    if (nameError) {
      document.getElementById("register-name-error").textContent = nameError;
      return;
    }

    if (emailError) {
      document.getElementById("register-email-error").textContent = emailError;
      return;
    }

    if (passwordError) {
      document.getElementById("register-password-error").textContent =
        passwordError;
      return;
    }

    if (confirmPasswordError) {
      document.getElementById("register-confirm-password-error").textContent =
        confirmPasswordError;
      return;
    }

    try {
      userManager.register({ name, email, password });
      alert("Registrasi berhasil! Silakan login dengan akun Anda.");
      router.navigate("login");

      document.getElementById("register-form").reset();
    } catch (error) {
      alert("Registrasi gagal: " + error.message);
    }
  });

document.getElementById("edit-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const userCurrent = userManager.getCurrentUser();
  if (!userCurrent) return;

  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const password = document.getElementById("edit-password").value;

  document
    .querySelectorAll("#edit-page .error")
    .forEach((el) => (el.textContent = ""));

  const nameError = Validator.validateName(name);
  const emailError = Validator.validateEmail(email);
  const passwordError = password ? Validator.validatePassword(password) : null;

  if (nameError) {
    document.getElementById("edit-name-error").textContent = nameError;
    return;
  }

  if (emailError) {
    document.getElementById("edit-email-error").textContent = emailError;
    return;
  }

  if (passwordError) {
    document.getElementById("edit-password-error").textContent = passwordError;
    return;
  }

  if (!confirm("Apakah Anda yakin ingin menyimpan perubahan?")) {
    return;
  }

  try {
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    userManager.updateUser(userCurrent.email, updateData);
    alert("Akun berhasil diperbarui!");
    router.navigate("dashboard");
  } catch (error) {
    alert("Update gagal: " + error.message);
  }
});

function logout() {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    userManager.clearCurrentUser();
    alert("Logout berhasil!");
    router.navigate("login");
  }
}

function deleteAccount() {
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!"
    )
  ) {
    const userCurrent = userManager.getCurrentUser();
    if (userCurrent) {
      userManager.deleteUser(userCurrent.email);
      alert("Akun berhasil dihapus!");
      router.navigate("login");
    }
  }
}

function showEditForm() {
  router.navigate("edit");
}

document.addEventListener("DOMContentLoaded", () => {
  const userCurrent = userManager.getCurrentUser();
  if (userCurrent) {
    router.navigate("dashboard");
  } else {
    router.navigate("login");
  }
});

setInterval(() => {
  userManager.cleanupOldAccounts();
}, 60 * 60 * 1000);
