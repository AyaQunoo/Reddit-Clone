import { EmailType } from "@/types/api";
import handlebars from 'handlebars';
export function generateEmailHtml(name:string, hashedToken:string, emailType:EmailType) {
  const emailData = {
    subject: emailType === EmailType.RESET ? 'Reset Password' : 'Welcome to Reddit',
    title: `Hello, ${name}`,
    intro: emailType === EmailType.RESET ? 'You have received this email because a password reset request for your account was received.' : "Welcome to Reddit! We're very excited to have you on board.",
    instructions: emailType === EmailType.RESET ? 'Click the button below to reset your password:' : 'To get started with Reddit, please click here:',
    button: {
      color: emailType === EmailType.RESET ? '#DC4D2F' : '#22BC66',
      text: emailType === EmailType.RESET ? 'Reset your password' : 'Confirm your account',
      link: `${process.env.DOMAIN}/${emailType === EmailType.RESET ? 'resetPassword' : 'verifyemail'}?token=${hashedToken}`,
    },
    outro: emailType === EmailType.RESET ? "If you did not request a password reset, no further action is required on your part." : "Need help, or have questions? Just reply to this email, we'd love to help."
  };
  const html =` <html>
  <head>
    <title>${emailData.subject}</title>
  </head>
  <body>
    <h1>$${emailData.intro}</p>
    <p>${emailData.instructions}</p>
    <a href=${emailData.button.link} >
      ${emailData.button.text}
    </a>
    <p>${emailData.outro}</p>
  </body>
 </html>`
 const template = handlebars.compile(html);
  const emailHtml = template(emailData);
  return emailHtml;
}
