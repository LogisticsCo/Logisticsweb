import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL = 'frandelwanjawa19@gmail.com'
PASSWORD = 'yygd oqeh jrqg rkbq'

# Create the email content
msg = MIMEText('This is a test email.')
msg['Subject'] = 'Test Email'
msg['From'] = EMAIL
msg['To'] = 'frandelwanjawa@yahoo.com'

try:
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()  # Use TLS encryption
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, 'frandelwanjawa@yahoo.com', msg.as_string())
        print('Email sent successfully!')
except Exception as e:
    print(f'Error: {e}')
