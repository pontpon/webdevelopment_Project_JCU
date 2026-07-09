// Main document ready function that handles both pages
document.addEventListener("DOMContentLoaded", () => {
    // Elements that might exist on booking.html
    const bookingForm = document.getElementById("bookingForm")
    const successMessage = document.getElementById("successMessage")
    const closeSuccessBtn = document.getElementById("closeSuccessBtn")

    // Elements that might exist on booking-confirmed.html
    const bookingDetailsDiv = document.getElementById("bookingDetails")

    // Hamburger menu functionality
    const hamburger = document.querySelector(".hamburger")
    const mobileMenu = document.querySelector(".mobile-menu")
    const overlay = document.querySelector(".overlay")

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("open")
            mobileMenu.classList.toggle("open")
            overlay.classList.toggle("open")
            document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : ""
        })
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            hamburger.classList.remove("open")
            mobileMenu.classList.remove("open")
            overlay.classList.remove("open")
            document.body.style.overflow = ""
        })
    }

    // Close mobile menu when a link is clicked
    const mobileMenuLinks = document.querySelectorAll(".mobile-menu a")
    if (mobileMenuLinks) {
        mobileMenuLinks.forEach((link) => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("open")
                mobileMenu.classList.remove("open")
                overlay.classList.remove("open")
                document.body.style.overflow = ""
            })
        })
    }

    // Handle booking form if it exists (booking.html)
    if (bookingForm) {
        console.log("Booking form detected - initializing form handlers")

        // Form submission handler
        bookingForm.addEventListener("submit", (event) => {
            // Prevent default form submission
            event.preventDefault()

            // Basic form validation
            const requiredFields = bookingForm.querySelectorAll("[required]")
            let isValid = true

            requiredFields.forEach((field) => {
                if (!field.value.trim()) {
                    isValid = false
                    field.classList.add("error")
                } else {
                    field.classList.remove("error")
                }
            })

            if (!isValid) {
                alert("Please fill in all required fields.")
                return
            }

            // Collect form data
            const formData = new FormData(bookingForm)
            const bookingData = {}

            for (const [key, value] of formData.entries()) {
                bookingData[key] = value
            }

            console.log("Booking data:", bookingData)

            // Store booking data in localStorage
            localStorage.setItem("bookingData", JSON.stringify(bookingData))

            // Redirect to confirmation page
            window.location.href = "booking-confirmed.html"
        })

        // Add input validation styling
        const formInputs = document.querySelectorAll(".booking-form input, .booking-form select, .booking-form textarea")
        formInputs.forEach((input) => {
            input.addEventListener("blur", function () {
                if (this.hasAttribute("required") && !this.value.trim()) {
                    this.classList.add("error")
                } else {
                    this.classList.remove("error")
                }
            })

            input.addEventListener("input", function () {
                if (this.classList.contains("error") && this.value.trim()) {
                    this.classList.remove("error")
                }
            })
        })

        // Close success message and show form again (if inline success message exists)
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener("click", () => {
                successMessage.style.display = "none"
                bookingForm.style.display = "block"
                bookingForm.reset()
            })
        }
    }

    // Handle booking confirmation page if it exists (booking-confirmed.html)
    if (bookingDetailsDiv) {
        console.log("Booking confirmation page detected - displaying booking details")

        // Get booking data from localStorage
        let bookingData = {}
        const storedData = localStorage.getItem("bookingData")

        if (storedData) {
            try {
                bookingData = JSON.parse(storedData)
                console.log("Retrieved booking data from localStorage:", bookingData)
            } catch (e) {
                console.error("Error parsing stored booking data:", e)
            }
        }

        // Get current date and time for the confirmation
        const now = new Date()
        const formattedDate = now.toLocaleDateString()
        const formattedTime = now.toLocaleTimeString()

        // Create a reference number
        const referenceNumber = "SMD" + now.getTime().toString().slice(-6)

        // Map service values to readable names
        const serviceNames = {
            "check-up": "Regular Check-up",
            cleaning: "Teeth Cleaning",
            whitening: "Teeth Whitening",
            implants: "Dental Implants",
            orthodontics: "Orthodontics",
            cosmetic: "Cosmetic Dentistry",
            "root-canal": "Root Canal Treatment",
            pediatric: "Pediatric Dentistry",
            emergency: "Emergency Care",
        }

        // Map time values to readable names
        const timeNames = {
            morning: "Morning (8:30 AM - 12:00 PM)",
            afternoon: "Afternoon (1:00 PM - 4:00 PM)",
            evening: "Evening (4:00 PM - 6:30 PM)",
        }

        // Map dentist values to readable names
        const dentistNames = {
            "dr-grey": "Dr. Johanna Grey (Orthodontics)",
            "dr-carter": "Dr. Emily Carter (Pediatric Dentist)",
            "dr-sloan": "Dr. Benedict Sloan",
            "": "Any available dentist",
        }

        // Format the appointment date
        let formattedAppointmentDate = bookingData.date || "Not specified"
        try {
            if (bookingData.date) {
                const dateParts = bookingData.date.split("-")
                if (dateParts.length === 3) {
                    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                    formattedAppointmentDate = date.toLocaleDateString()
                }
            }
        } catch (e) {
            console.error("Error formatting date:", e)
        }

        // Create the booking details HTML
        const detailsHTML = `
              <div class="detail-item">
                  <div class="detail-label">Reference Number:</div>
                  <div class="detail-value">${referenceNumber}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Booking Date:</div>
                  <div class="detail-value">${formattedDate}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Patient Name:</div>
                  <div class="detail-value">${bookingData.fullName || "Not specified"}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Contact Email:</div>
                  <div class="detail-value">${bookingData.email || "Not specified"}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Contact Phone:</div>
                  <div class="detail-value">${bookingData.phone || "Not specified"}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Appointment Date:</div>
                  <div class="detail-value">${formattedAppointmentDate}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Appointment Time:</div>
                  <div class="detail-value">${timeNames[bookingData.time] || bookingData.time || "Not specified"}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Service:</div>
                  <div class="detail-value">${serviceNames[bookingData.service] || bookingData.service || "Not specified"}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Dentist:</div>
                  <div class="detail-value">${dentistNames[bookingData.dentist] || bookingData.dentist || "Any available dentist"}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Additional Information:</div>
                  <div class="detail-value">${bookingData.message || "None provided"}</div>
              </div>
          `

        // Insert the details into the page
        bookingDetailsDiv.innerHTML = detailsHTML

        // Add print functionality if needed
        const printBtn = document.querySelector(".print-btn")
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                window.print()
            })
        }
    }
})

// Log that the script has loaded
console.log("100SMILES Dental Care booking script loaded successfully")
