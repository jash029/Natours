const nodemailer = require("nodemailer");
const { htmlToText } = require("html-to-text");
const pug = require("pug");

module.exports = class Email {
  constructor(user, resetURl) {
    this.to = user.email;
    this.firstName = (user.fullName || user.name).split(" ")[0] || null;

    this.url = resetURl;

    this.from = `Natours @Co <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER_PRODUCTION,
          pass: process.env.EMAIL_PASS_PRODUCTION,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(template, subject, options = {}) {
    try {
      console.log("Step 1");
      const {
        booking,
        token,
        mode,
        date,
        time,
        status,
        notes,
        assistance,
        replyMessage,
        rejectedDocsList,
        contactPhone,
      } = options;

      const objPug = {
        firstName: this.firstName,
        url: this.url,
        subject,
      };

      if (booking) objPug.book = booking;
      if (token) objPug.otp = token;
      if (status !== undefined) objPug.status = status;
      if (notes !== undefined) objPug.notes = notes;
      if (assistance !== undefined) objPug.assistance = assistance;
      if (replyMessage !== undefined) objPug.replyMessage = replyMessage;
      if (rejectedDocsList) objPug.rejectedDocsList = rejectedDocsList;
      if (contactPhone) objPug.contactPhone = contactPhone;

      if (mode && date) {
        ((objPug.meetingMode = mode),
          (objPug.date = date),
          (objPug.time = time));
      }

      console.log("Step 2", objPug);

      const html = pug.renderFile(
        `${__dirname}/../services/emails/${template}.pug`,
        objPug,
      );

      console.log("Step 3 PUG SUCCESS");

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      console.log("Step 4 MAIL OPTIONS READY");

      await this.newTransport().sendMail(mailOptions);

      console.log("Step 5 EMAIL SENT");
    } catch (err) {
      console.error("EMAIL INTERNAL ERROR");
      console.error(err);
      throw err;
    }
  }

  async sendResetPassword() {
    await this.send(
      "resetPassword",
      "Your Password reset token (valid for 10 minutes)",
    );
  }

  async sendOtpVerification(otp) {
    await this.send(
      "emailVerify",
      "Please Verify your Email By Providing Below Otp to Given Link",
      {
        token: otp,
      },
    );
  }

  async sendConsultant(mode, date, time) {
    await this.send("consultant", "Natours | Consultation Request Received", {
      mode,
      date,
      time,
    });
  }

  async sendBookingEmail(booking) {
    await this.send("invoice", "Natours | Booking Invoice", { booking });
  }

  async sendConsultationEmail(status, notes) {
    await this.send("consultantService", "Natours | Consultation Update", {
      status,
      notes,
    });
  }

  async sendBookingQuery(assistance) {
    await this.send("bookingQuery", "Natours | Support Query Confirmation", {
      assistance,
    });
  }

  async sendBookingQueryReply(assistance, replyMessage) {
    await this.send(
      "bookingQueryReply",
      `Natours Support | Re: ${assistance.subject}`,
      {
        assistance,
        replyMessage,
      },
    );
  }

  async sendDocumentRejection(booking, rejectedDocsList) {
    await this.send(
      "documentVerificationActionRequired",
      `Natours | Action Required - Document Verification for ${booking.bookingNumber}`,
      {
        booking,
        rejectedDocsList,
      },
    );
  }

  async sendDocumentVerificationComplete(
    booking,
    contactPhone = "+91 91111 11111",
  ) {
    await this.send(
      "documentVerificationComplete",
      `Natours | Documents Verified - ${booking.bookingNumber}`,
      {
        booking,
        contactPhone,
      },
    );
  }
};