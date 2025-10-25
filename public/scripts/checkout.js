document.addEventListener("DOMContentLoaded", () => {
  const app = {
    // --- STATE ---
    state: {
      allCourses: {
        illustrator: {
          id: "illustrator",
          name: "Adobe Illustrator",
          price: 60000,
          image: "/assets/svg/illustrator.svg",
        },
        photoshop: {
          id: "photoshop",
          name: "Adobe Photoshop",
          price: 50000,
          image: "/assets/svg/photoshop.svg",
        },
        figma: {
          id: "figma",
          name: "Figma",
          price: 55000,
          image: "/assets/svg/figma.svg",
        },
      },
      cart: [],
      hasPaid: false,
      selectedPaymentMethod: null,
    },

    // --- DOM ELEMENTS ---
    elements: {
      appRoot: document.getElementById("app-root"),
      modalContainer: document.getElementById("modal-container"),
      templates: {
        checkoutPage: document.getElementById("template-checkout-page"),
        orderSummary: document.getElementById("template-order-summary"),
        cartItem: document.getElementById("template-cart-item"),
        checkoutForm: document.getElementById("template-checkout-form"),
        receipt: document.getElementById("template-receipt"),
        paymentModal: document.getElementById("template-payment-modal"),
        emptyCart: document.getElementById("template-empty-cart"),
      },
    },

    // --- INITIALIZATION ---
    init() {
      this.loadCartFromUrl();
      this.loadCartFromLocalStorage();
      this.render();
      this.bindGlobalListeners();
    },

    // --- PAGE & COMPONENT RENDERING ---
    render() {
      this.elements.appRoot.innerHTML = "";
      if (this.state.cart.length === 0) {
        this.renderEmptyCart();
      } else {
        this.renderCheckoutPage();
      }
    },

    renderEmptyCart() {
      const emptyCartNode =
        this.elements.templates.emptyCart.content.cloneNode(true);
      this.elements.appRoot.appendChild(emptyCartNode);
    },

    renderCheckoutPage() {
      const pageNode =
        this.elements.templates.checkoutPage.content.cloneNode(true);
      this.elements.appRoot.appendChild(pageNode);

      const formContainer = this.elements.appRoot.querySelector(
        "#form-receipt-container"
      );
      const summaryContainer =
        this.elements.appRoot.querySelector("#summary-container");

      const formNode =
        this.elements.templates.checkoutForm.content.cloneNode(true);
      formContainer.appendChild(formNode);

      const summaryNode =
        this.elements.templates.orderSummary.content.cloneNode(true);
      summaryContainer.appendChild(summaryNode);

      this.updateOrderSummary();
      this.bindFormListeners();
      this.autofillEmailFromUrl();
    },

    updateOrderSummary() {
      const summaryContent = this.elements.appRoot.querySelector(
        "#order-summary-content"
      );
      if (!summaryContent) return;

      this.renderCartItems(summaryContent);
      this.updateSummaryTotals(summaryContent);
      this.renderAddCourse(summaryContent);
    },

    renderCartItems(container) {
      const cartItemsEl = container.querySelector("#cart-items");
      cartItemsEl.innerHTML = "";

      this.state.cart.forEach((course) => {
        const itemNode =
          this.elements.templates.cartItem.content.cloneNode(true);
        itemNode.querySelector("[data-cart-item='image']").src = course.image;
        itemNode.querySelector(
          "[data-cart-item='image']"
        ).alt = `${course.name} Logo`;
        itemNode.querySelector("[data-cart-item='name']").textContent =
          course.name;
        itemNode.querySelector("[data-cart-item='price']").textContent =
          this.formatCurrency(course.price);
        itemNode.querySelector(".remove-item-btn").dataset.courseId = course.id;
        cartItemsEl.appendChild(itemNode);
      });
    },

    updateSummaryTotals(container) {
      const subtotal = this.state.cart.reduce(
        (sum, course) => sum + course.price,
        0
      );
      const discount = this.state.cart.length >= 2 ? subtotal * 0.08 : 0;
      const total = subtotal - discount;

      container.querySelector("[data-summary='subtotal']").textContent =
        this.formatCurrency(subtotal);
      container.querySelector("[data-summary='total']").textContent =
        this.formatCurrency(total);
      container.querySelector(
        "[data-summary='discount-amount']"
      ).textContent = `- ${this.formatCurrency(discount)}`;
      container
        .querySelector("[data-summary='discount-row']")
        .classList.toggle("hidden", discount === 0);
      container
        .querySelector("#discount-info")
        .classList.toggle(
          "hidden",
          !(
            this.state.cart.length === 1 &&
            Object.keys(this.state.allCourses).length > 1
          )
        );
    },

    renderAddCourse(container) {
      const addCourseContainer = container.querySelector(
        "#add-course-container"
      );
      const availableCourses = Object.values(this.state.allCourses).filter(
        (c) => !this.state.cart.some((cartItem) => cartItem.id === c.id)
      );

      addCourseContainer.style.display =
        availableCourses.length > 0 ? "block" : "none";
      if (availableCourses.length > 0) {
        addCourseContainer.innerHTML = `<div class="relative"><button type="button" id="add-course-button" class="w-full flex items-center justify-center space-x-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg><span>Add another course</span></button><ul id="add-course-list" class="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-1.5 hidden z-10">${availableCourses
          .map(
            (course) =>
              `<li><button type="button" data-course-id="${course.id}" class="add-course-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">${course.name}</button></li>`
          )
          .join("")}</ul></div>`;
      }
    },

    // --- CART LOGIC ---
    addCourse(courseId) {
      const course = this.state.allCourses[courseId];
      if (course && !this.state.cart.find((c) => c.id === courseId)) {
        this.state.cart.push(course);
        this.saveCartToLocalStorage();
        this.updateOrderSummary();
      }
    },

    removeCourse(courseId) {
      this.state.cart = this.state.cart.filter(
        (course) => course.id !== courseId
      );
      this.saveCartToLocalStorage();
      if (this.state.cart.length === 0) {
        this.render();
      } else {
        this.updateOrderSummary();
      }
    },

    // --- STORAGE & URL HANDLING ---
    saveCartToLocalStorage() {
      localStorage.setItem(
        "reinmaxCart",
        JSON.stringify(this.state.cart.map((item) => item.id))
      );
    },

    loadCartFromLocalStorage() {
      const savedCartIds = JSON.parse(
        localStorage.getItem("reinmaxCart") || "[]"
      );
      const loadedCart = savedCartIds
        .map((id) => this.state.allCourses[id])
        .filter(Boolean);
      loadedCart.forEach((course) => {
        if (!this.state.cart.some((c) => c.id === course.id))
          this.state.cart.push(course);
      });
    },

    loadCartFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const courseId = params.get("course");
      if (courseId && this.state.allCourses[courseId]) {
        if (!this.state.cart.some((c) => c.id === courseId)) {
          this.state.cart.push(this.state.allCourses[courseId]);
        }
      }
    },

    autofillEmailFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const emailFromUrl = params.get("email");
      const emailInput = this.elements.appRoot.querySelector("#email");
      if (emailFromUrl && emailInput) {
        emailInput.value = decodeURIComponent(emailFromUrl);
      }
      if (params.has("course") || params.has("email")) {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({ path: newUrl }, "", newUrl);
      }
    },

    // --- EVENT BINDING & HANDLING ---
    bindGlobalListeners() {
      document.body.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".remove-item-btn");
        if (removeBtn) this.removeCourse(removeBtn.dataset.courseId);

        if (e.target.closest("#add-course-button")) {
          e.stopPropagation();
          document.getElementById("add-course-list").classList.toggle("hidden");
        }

        const addCourseItem = e.target.closest(".add-course-item");
        if (addCourseItem) {
          this.addCourse(addCourseItem.dataset.courseId);
          document.getElementById("add-course-list").classList.add("hidden");
        }

        const list = document.getElementById("add-course-list");
        if (
          list &&
          !list.classList.contains("hidden") &&
          !e.target.closest("#add-course-container")
        ) {
          list.classList.add("hidden");
        }
      });
    },

    bindFormListeners() {
      const form = this.elements.appRoot.querySelector("#checkout-form");
      if (!form) return;

      const inputs = {
        fullName: form.querySelector("#fullName"),
        email: form.querySelector("#email"),
        phone: form.querySelector("#phone"),
        transactionId: form.querySelector("#transactionId"),
      };

      const validateField = (field) => {
        const errorEl = form.querySelector(`[data-error-for="${field}"]`);
        let isValid = true;
        errorEl.textContent = "";
        inputs[field]?.classList.remove("invalid");

        switch (field) {
          case "fullName":
            if (inputs.fullName.value.trim() === "") {
              errorEl.textContent = "Full name is required.";
              isValid = false;
            }
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email.value)) {
              errorEl.textContent = "Please enter a valid email address.";
              isValid = false;
            }
            break;
          case "phone":
            if (!/^\+?[0-9\s-()]{10,}$/.test(inputs.phone.value)) {
              errorEl.textContent = "Please enter a valid phone number.";
              isValid = false;
            }
            break;
          case "transactionId":
            if (
              inputs.transactionId.required &&
              inputs.transactionId.value.trim() === ""
            ) {
              errorEl.textContent = "Transaction ID is required.";
              isValid = false;
            }
            break;
        }
        if (!isValid) inputs[field]?.classList.add("invalid");
        return isValid;
      };

      Object.keys(inputs).forEach((key) =>
        inputs[key]?.addEventListener("input", () => validateField(key))
      );

      form.querySelectorAll(".payment-option").forEach((option) => {
        option.addEventListener("click", () => {
          if (option.classList.contains("selected")) return;
          const totalText = this.elements.appRoot.querySelector(
            "[data-summary='total']"
          ).textContent;
          this.showPaymentModal(option.dataset.payment, totalText);
        });
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission(form, inputs, validateField);
      });
    },

    handleFormSubmission(form, inputs, validator) {
      const formMessage = form.querySelector("#form-message");
      const captchaError = form.querySelector('[data-error-for="captcha"]');
      formMessage.textContent = "";

      const isFormValid = Object.keys(inputs).reduce(
        (acc, key) => validator(key) && acc,
        true
      );
      const isCaptchaValid =
        form.querySelector('[name="h-captcha-response"]')?.value.trim() !== "";

      if (!isCaptchaValid)
        captchaError.textContent = "Please complete the security check.";
      else captchaError.textContent = "";

      if (!this.state.selectedPaymentMethod) {
        formMessage.textContent = "Please select a payment method.";
        formMessage.style.color = "red";
        return;
      }

      if (!isFormValid || !isCaptchaValid) {
        formMessage.textContent = "Please correct the errors above.";
        formMessage.style.color = "red";
        return;
      }

      const submitButton = form.querySelector("#submit-button");
      submitButton.disabled = true;
      submitButton.innerHTML = `<div class="loader"></div>`;

      setTimeout(() => {
        this.showReceipt(inputs);
        localStorage.removeItem("reinmaxCart");
      }, 1500);
    },

    // --- MODAL & RECEIPT ---
    showPaymentModal(method, totalAmount) {
      const modalNode =
        this.elements.templates.paymentModal.content.cloneNode(true);
      const isMobile = method === "mobile";
      modalNode.querySelector("[data-modal='title']").textContent = isMobile
        ? "Mobile Money Payment"
        : "Bank Transfer Payment";

      const detailsHTML = isMobile
        ? `<p class="text-gray-600">Please send <strong class="text-tertiary">${totalAmount}</strong> to:</p><p class="my-4 text-2xl font-bold text-center text-primary bg-gray-100 p-3 rounded-lg font-mono">0678 700 731</p><p class="text-sm text-gray-500">Networks: Tigo Pesa, M-Pesa, Airtel Money.</p>`
        : `<p class="text-gray-600">Please transfer <strong class="text-tertiary">${totalAmount}</strong> to:</p><div class="my-4 text-left text-primary bg-gray-100 p-4 rounded-lg space-y-2 text-md"><p><strong>Bank:</strong> CRDB Bank</p><p><strong>Name:</strong> Reinmax Creative</p><p class="font-mono"><strong>Account:</strong> 1234 5678 9012</p></div>`;
      modalNode.querySelector("[data-modal='details']").innerHTML = detailsHTML;

      this.elements.modalContainer.innerHTML = "";
      this.elements.modalContainer.appendChild(modalNode);

      const modalEl = this.elements.modalContainer.querySelector(".fixed");
      modalEl.classList.add("modal-enter");
      modalEl
        .querySelector("#modal-content")
        .classList.add("modal-content-enter");

      const handlePaymentChoice = (paid) => {
        this.state.hasPaid = paid;
        const form = this.elements.appRoot.querySelector("#checkout-form");
        form
          .querySelectorAll(".payment-option")
          .forEach((opt) => opt.classList.remove("selected"));
        form
          .querySelector(`[data-payment="${method}"]`)
          .classList.add("selected");
        this.state.selectedPaymentMethod = method;

        const transactionContainer = form.querySelector(
          "#transaction-id-container"
        );
        const transactionInput = form.querySelector("#transactionId");
        transactionContainer.classList.toggle("hidden", !paid);
        if (paid) transactionContainer.classList.add("fade-in");
        transactionInput.required = paid;
        if (!paid) transactionInput.value = "";

        this.closePaymentModal();
      };

      modalEl.querySelector('[data-modal-action="paid"]').onclick = () =>
        handlePaymentChoice(true);
      modalEl.querySelector('[data-modal-action="not-paid"]').onclick = () =>
        handlePaymentChoice(false);
      modalEl.querySelector("#modal-backdrop").onclick = () =>
        this.closePaymentModal();
    },

    closePaymentModal() {
      const modalEl = this.elements.modalContainer.querySelector(".fixed");
      if (!modalEl) return;
      modalEl.classList.add("modal-leave");
      modalEl
        .querySelector("#modal-content")
        .classList.add("modal-content-leave");
      setTimeout(() => {
        this.elements.modalContainer.innerHTML = "";
      }, 300);
    },

    showReceipt(formInputs) {
      const summaryContainer =
        this.elements.appRoot.querySelector("#summary-container");
      summaryContainer.style.transition = "opacity 0.3s";
      summaryContainer.style.opacity = "0.5";

      const formReceiptContainer = this.elements.appRoot.querySelector(
        "#form-receipt-container"
      );
      const receiptNode =
        this.elements.templates.receipt.content.cloneNode(true);

      // Populate receipt data
      const subtotal = this.state.cart.reduce((sum, c) => sum + c.price, 0);
      const discount = this.state.cart.length >= 2 ? subtotal * 0.08 : 0;
      const enrollmentData = {
        fullName: formInputs.fullName.value,
        email: formInputs.email.value,
        enrollmentId: "RC-" + Date.now().toString().slice(-8),
        transactionId: formInputs.transactionId.value.trim().toUpperCase(),
        total: this.formatCurrency(subtotal - discount),
        subtotal: this.formatCurrency(subtotal),
        discount: `- ${this.formatCurrency(discount)}`,
        paid: this.state.hasPaid,
        items: this.state.cart.map((c) => ({
          name: c.name,
          price: this.formatCurrency(c.price),
        })),
      };

      receiptNode.querySelector("[data-receipt='enrollmentId']").textContent =
        enrollmentData.enrollmentId;
      receiptNode.querySelector("[data-receipt='fullName']").textContent =
        enrollmentData.fullName;
      receiptNode.querySelector("[data-receipt='email']").textContent =
        enrollmentData.email;

      const statusHTML = enrollmentData.paid
        ? `<div class="inline-flex items-center space-x-2 text-green-700 bg-green-100 py-1.5 px-3 rounded-full text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>Paid</span></div>`
        : `<div class="inline-flex items-center space-x-2 text-amber-700 bg-amber-100 py-1.5 px-3 rounded-full text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6"/><path d="M12 16h.01"/></svg><span>Pending</span></div>`;
      receiptNode.querySelector("[data-receipt='paymentStatus']").innerHTML =
        statusHTML;

      if (enrollmentData.paid && enrollmentData.transactionId) {
        receiptNode.querySelector(
          "[data-receipt='transactionIdWrapper']"
        ).innerHTML = `<p class="text-gray-500 mt-2 text-xs">Transaction ID: <span class="font-semibold text-gray-800 font-mono">${enrollmentData.transactionId}</span></p>`;
      }

      const itemsList = receiptNode.querySelector("[data-receipt='itemsList']");
      enrollmentData.items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "py-3 flex justify-between items-center text-md";
        li.innerHTML = `<p class="font-medium text-gray-800">${item.name}</p><p class="font-mono text-gray-700">${item.price}</p>`;
        itemsList.appendChild(li);
      });

      receiptNode.querySelector("[data-receipt='subtotal']").textContent =
        enrollmentData.subtotal;
      receiptNode.querySelector("[data-receipt='discount']").textContent =
        enrollmentData.discount;
      receiptNode.querySelector("[data-receipt='total']").textContent =
        enrollmentData.total;

      formReceiptContainer.innerHTML = "";
      formReceiptContainer.appendChild(receiptNode);

      new QRCode(formReceiptContainer.querySelector("#qrcode-container"), {
        text: enrollmentData.enrollmentId,
        width: 90,
        height: 90,
        colorDark: "#002828",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      formReceiptContainer
        .querySelector("#download-pdf-btn")
        .addEventListener("click", () =>
          this.downloadReceiptAsPDF(enrollmentData.enrollmentId)
        );
    },

    downloadReceiptAsPDF(enrollmentId) {
      const { jsPDF } = window.jspdf;
      const receiptElement = document.getElementById("receipt-content");
      html2canvas(receiptElement, { scale: 2, backgroundColor: null }).then(
        (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
          pdf.save(`Reinmax-Receipt-${enrollmentId}.pdf`);
        }
      );
    },

    // --- UTILITIES ---
    formatCurrency(amount) {
      return `${amount.toLocaleString("en-US")} TZS`;
    },
  };

  // Start the application
  app.init();
});
