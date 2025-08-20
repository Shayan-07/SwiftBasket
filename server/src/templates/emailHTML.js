const passOTPHTML = (otp) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <div style="font-family: 'Montserrat', Arial, sans-serif;max-width: 500px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <h2 style="font-family: 'Montserrat', Arial, sans-serif;color: #2c3e50; text-align: center;">🔐 Password Reset Request</h2>
                    
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 16px; color: #333;">Hello,</p>
                    
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 16px; color: #333;">
                    You recently requested to reset your password for your <strong>SwiftBasket</strong> account.
                    Use the OTP below to proceed. This code is valid for the next <strong>15 minutes</strong>.
                    </p>

                    <div style="font-family: 'Montserrat', Arial, sans-serif;background-color: #ffffff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; border: 1px solid #ddd;">
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 18px; margin: 0; color: #555;">Your One-Time Password (OTP):</p>
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 32px; font-weight: bold; margin: 10px 0; color: #ff5252;">${otp}</p>
                    </div>

                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 14px; color: #777;">
                    If you didn’t request this, as long as you don't share it with someone you can safely ignore this email — your password will remain unchanged.
                    </p>

                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 14px; color: #aaa; text-align: center; margin-top: 40px;">
                    &mdash; The SwiftBasket Team
                    </p>
                </div>
            </body>
        </html>
    `
}

export { passOTPHTML }


const emailVerifyOTPHTML = (otp) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <div style="font-family: 'Montserrat', Arial, sans-serif;max-width: 500px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <h2 style="font-family: 'Montserrat', Arial, sans-serif;color: #2c3e50; text-align: center;">📧 Email Verification</h2>
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 16px; color: #333;">Hello,</p>
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 16px; color: #333;">
                        Thank you for signing up for <strong>SwiftBasket</strong>! To complete your registration, please use the verification code below. This code is valid for the next <strong>15 minutes</strong>.
                    </p>
                    <div style="font-family: 'Montserrat', Arial, sans-serif;background-color: #ffffff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; border: 1px solid #ddd;">
                        <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 18px; margin: 0; color: #555;">Your Email Verification Code:</p>
                        <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 32px; font-weight: bold; margin: 10px 0; color: #ff5252;">${otp}</p>
                    </div>
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 14px; color: #777;">
                        If you didn’t create this account, you can safely ignore this email.
                    </p>
                    <p style="font-family: 'Montserrat', Arial, sans-serif;font-size: 14px; color: #aaa; text-align: center; margin-top: 40px;">
                        &mdash; The SwiftBasket Team
                    </p>
                </div>
            </body>
        </html>
    `
}

export { emailVerifyOTPHTML }