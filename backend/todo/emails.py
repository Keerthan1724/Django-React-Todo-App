from django.core.mail import send_mail
from django.conf import settings

def send_welcome_email(user):
    subject = "Welcome to 📝 TODO APP! 🎉"
    message = f"""
Hi {user.username},

Welcome to 📝 TODO APP! Your account has been successfully created.

You can now create, manage, and track your todos easily. All your tasks are safe and securely stored with us.

Thanks,
The 📝 TODO APP Team
"""
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False
    )

def send_otp_email(user, otp):
    subject = "Your OTP Code 🔒"
    message = f"""
Hi {user.username},

Your One-Time Password (OTP) is: {otp}

It’s valid for the next 1 minute. Please do not share this code with anyone.

If you didn’t request this, you can safely ignore this email.

Thanks,
The 📝 TODO APP Team
"""
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False
    )
