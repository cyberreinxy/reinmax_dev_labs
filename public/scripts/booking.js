document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const dateInput = document.getElementById("date");

  // Function to parse URL query parameters
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Set minimum date for the date input to today
  const setMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  };

  // Pre-fill form from URL parameters
  const prefillForm = () => {
    const name = getQueryParam("name");
    const email = getQueryParam("email");
    const service = getQueryParam("service");
    let date = getQueryParam("date"); // Use let as it might be modified
    const message = getQueryParam("message");

    if (name) form.elements.name.value = name;
    if (email) form.elements.email.value = email;
    if (service) form.elements.service.value = service;
        
    // Ensure pre-filled date is not in the past
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date for comparison
      if (selectedDate < today) {
        date = dateInput.min; // Set to today if past date is provided
      }
      form.elements.date.value = date;
    }

    if (message) form.elements.message.value = message;
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Client-side validation for date
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

    if (selectedDate < today) {
      alert("Please select a date that is not in the past.");
      dateInput.focus();
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Here you would typically send the data to a server
    alert("Your booking request has been submitted! We will get back to you shortly.");
    form.reset();
  };

  // Initialize
  setMinDate();
  prefillForm();
  form.addEventListener("submit", handleFormSubmit);
});
