document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-course-dialog]");

  buttons.forEach((button) => {
    const dialog = document.getElementById(button.dataset.courseDialog);
    if (!dialog) return;

    const closeButton = dialog.querySelector(".course-dialog-close");
    const closeDialog = () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    };

    button.addEventListener("click", () => {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    });

    closeButton?.addEventListener("click", () => {
      closeDialog();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog();
      }
    });
  });
});
