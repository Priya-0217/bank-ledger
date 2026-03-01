require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  },
  { logger: true, debug: true }
);

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    console.log('Sending email', { from: process.env.EMAIL_USER, to, subject });
    const info = await transporter.sendMail({
      from: `"Backend_Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


async function sendRegistrationemail(userEmail,name){
    const subject =" welcome to backend ledger"
    const text = `Hello ${name},Thank you for registering at Backend Ledger.We’re excited to have you onboard!Best regards,Backend Ledger Team`
    const html= `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome to Backend Ledger 🎉</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>
        Thank you for registering at <b>Backend Ledger</b>.
        We’re excited to have you onboard!
      </p>
      <p>
        If you have any questions, feel free to contact us anytime.
      </p>
      <br/>
      <p>Best regards,<br/>Backend Ledger Team</p>
    </div>`

    await sendEmail(userEmail,subject,text,html);
}

async function sendTransactionEmail(userEmail,name,amount,toAccount,transactionId){
    const subject =" transactional update"
    const text = `Hello ${name},Your transaction of ${amount} to account ${toAccount} has been completed.Transaction ID: ${transactionId        }`
    const html= `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Transactional Update 📧</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>
        Your transaction of <b>${amount}</b> to account <b>${toAccount}</b> has been completed.
        Transaction ID: <b>${transactionId}</b>   
      </p>
      <p>
        If you have any questions, feel free to contact us anytime.
      </p>
      <br/>
      <p>Best regards,<br/>Backend Ledger Team</p>
    </div>`

    await sendEmail(userEmail,subject,text,html);
}

module.exports = {
    sendRegistrationemail,
    sendEmail,
    sendTransactionEmail
};


