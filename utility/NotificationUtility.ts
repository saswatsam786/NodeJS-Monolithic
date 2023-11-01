// Email

// Notifications

// OTP
export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhonenumber: string) => {
  const accountSid = "ACece3ede73fa0a99c8a91cbf162f17cf4";
  const authToken = "89ecfea186a4ca6a645ac51cfaca9249";

  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+12566458932",
    to: `+91${toPhonenumber}`,
  });

  return response;
};

// Payment Notification or Emails
