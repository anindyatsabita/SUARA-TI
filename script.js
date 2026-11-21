const aspirationForm = document.querySelector("#aspirationForm");

if (aspirationForm) {
  const studentIdInput = aspirationForm.querySelector("#studentId");
  const categorySelect = aspirationForm.querySelector("#category");
  const aspirationInput = aspirationForm.querySelector("#aspiration");
  const attachmentInput = aspirationForm.querySelector("#attachment");
  const aspirationCounter = aspirationForm.querySelector("#aspirationCounter");
  const formFeedback = aspirationForm.querySelector("#formFeedback");
  const maximumAttachmentSize = 5 * 1024 * 1024;
  const allowedAttachmentTypes = ["image/jpeg", "image/png", "application/pdf"];

  const fieldErrors = [
    {
      input: studentIdInput,
      feedback: aspirationForm.querySelector("#studentIdError"),
      getMessage: () => {
        const studentId = studentIdInput.value.trim();

        if (!studentId) {
          return "NIM wajib diisi.";
        }

        if (!/^\d{10}$/.test(studentId)) {
          return "NIM harus terdiri dari tepat 10 angka.";
        }

        return "";
      },
    },
    {
      input: categorySelect,
      feedback: aspirationForm.querySelector("#categoryError"),
      getMessage: () => categorySelect.value ? "" : "Silakan pilih kategori aspirasi.",
    },
    {
      input: aspirationInput,
      feedback: aspirationForm.querySelector("#aspirationError"),
      getMessage: () => {
        const aspirationText = normalizeAspiration(aspirationInput.value);

        if (!aspirationText) {
          return "Isi aspirasi wajib diisi.";
        }

        if (aspirationText.length < 20) {
          return "Aspirasi minimal 20 karakter setelah spasi di awal dan akhir dihapus.";
        }

        if (aspirationText.length > 2000) {
          return "Aspirasi tidak boleh lebih dari 2000 karakter.";
        }

        return "";
      },
    },
    {
      input: attachmentInput,
      feedback: aspirationForm.querySelector("#attachmentError"),
      getMessage: () => {
        const [attachment] = attachmentInput.files;

        if (!attachment) {
          return "";
        }

        if (attachment.size > maximumAttachmentSize) {
          return "Ukuran lampiran melebihi batas 5 MB.";
        }

        if (!allowedAttachmentTypes.includes(attachment.type)) {
          return "Format lampiran harus JPG, PNG, atau PDF.";
        }

        return "";
      },
    },
  ];

  function normalizeAspiration(value) {
    return value.trim().replace(/[ \t]+/g, " ");
  }

  function updateCharacterCounter() {
    const characterCount = aspirationInput.value.length;
    aspirationCounter.textContent = `${characterCount}/2000`;
    aspirationCounter.classList.toggle("isAtLimit", characterCount >= 2000);
  }

  function validateField(field) {
    const errorMessage = field.getMessage();
    field.feedback.textContent = errorMessage;
    field.input.classList.toggle("isInvalid", Boolean(errorMessage));
    field.input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    return !errorMessage;
  }

  function showFormFeedback(message, isError = false) {
    formFeedback.textContent = message;
    formFeedback.classList.toggle("isError", isError);
    formFeedback.hidden = false;
  }

  function clearFormFeedback() {
    formFeedback.textContent = "";
    formFeedback.classList.remove("isError");
    formFeedback.hidden = true;
  }

  aspirationInput.addEventListener("input", () => {
    updateCharacterCounter();
    validateField(fieldErrors[2]);
    clearFormFeedback();
  });

  for (const field of fieldErrors) {
    field.input.addEventListener("input", () => {
      validateField(field);
      clearFormFeedback();
    });

    field.input.addEventListener("change", () => {
      validateField(field);
      clearFormFeedback();
    });
  }

  aspirationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormFeedback();

    const isFormValid = fieldErrors
      .map((field) => validateField(field))
      .every(Boolean);

    if (!isFormValid) {
      const firstInvalidField = fieldErrors.find((field) => !field.input.validity.valid
        || field.input.getAttribute("aria-invalid") === "true");
      firstInvalidField?.input.focus();
      showFormFeedback("Periksa kembali kolom yang ditandai sebelum mengirim.", true);
      return;
    }

    studentIdInput.value = studentIdInput.value.trim();
    aspirationInput.value = normalizeAspiration(aspirationInput.value);
    showFormFeedback(
      "Validasi berhasil. Pengiriman ini hanya simulasi lokal; data belum disimpan ke server.",
    );
    formFeedback.focus();
  });

  updateCharacterCounter();
}
