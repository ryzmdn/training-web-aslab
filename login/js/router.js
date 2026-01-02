class Router {
  constructor() {
    this.routes = {
      login: "login-page",
      register: "register-page",
      dashboard: "dashboard-page",
      edit: "edit-page",
    };
    this.currentRoute = "login";
  }

  navigate(route) {
    if (this.routes[route]) {
      Object.values(this.routes).forEach((pageId) => {
        document.getElementById(pageId).classList.add("hidden");
      });

      document.getElementById(this.routes[route]).classList.remove("hidden");
      this.currentRoute = route;

      if (route === "dashboard") {
        this.loadDashboard();
      } else if (route === "edit") {
        this.loadEditForm();
      }
    }
  }

  loadDashboard() {
    const userCurrent = userManager.getCurrentUser();
    if (userCurrent) {
      document.getElementById("user-name").textContent = userCurrent.name;
      document.getElementById("login-time").textContent = new Date(
        userCurrent.lastLogin
      ).toLocaleString("id-ID");
      document.getElementById("detail-name").textContent = userCurrent.name;
      document.getElementById("detail-email").textContent = userCurrent.email;
      document.getElementById("detail-created").textContent = new Date(
        userCurrent.createdAt
      ).toLocaleString("id-ID");
      document.getElementById("detail-last-login").textContent = new Date(
        userCurrent.lastLogin
      ).toLocaleString("id-ID");
    }
  }

  loadEditForm() {
    const userCurrent = userManager.getCurrentUser();
    if (userCurrent) {
      document.getElementById("edit-name").value = userCurrent.name;
      document.getElementById("edit-email").value = userCurrent.email;
    }
  }
}
