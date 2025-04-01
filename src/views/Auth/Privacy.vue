<template>
     <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Privacy and Policy</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Privacy & Policy</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    Effective Date: [Date]

                    At [Your Company Name], we respect and value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or use our services. By using our services, you agree to the collection and use of information in accordance with this policy.

                    1. Information We Collect

                    We collect personal information that you provide directly to us, such as:

                    Name

                    Email address

                    Phone number

                    Billing address

                    Payment details (when applicable)

                    We may also automatically collect non-personal information, such as:

                    Browser type

                    Device information

                    IP address

                    Pages you visit on our website

                    2. How We Use Your Information

                    We use the information we collect to:

                    Provide and improve our services

                    Respond to your inquiries and support requests

                    Process payments and transactions

                    Send promotional emails, newsletters, and updates (if you have opted in)

                    Comply with legal obligations

                    3. How We Protect Your Information

                    We use a variety of security measures to protect your personal data, including encryption, secure servers, and access controls. While we strive to ensure the safety of your data, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.

                    4. Sharing Your Information

                    We do not sell, rent, or lease your personal information to third parties. However, we may share your information with trusted third-party service providers who help us operate our website and services, such as payment processors and email providers. These third parties are obligated to protect your data and only use it for the purposes we specify.

                    5. Cookies

                    We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us improve our website’s functionality and analyze usage patterns. You can control cookie preferences through your browser settings.

                    6. Your Rights and Choices

                    You have the right to:

                    Access, update, or delete your personal information

                    Opt-out of marketing communications

                    Request the restriction of your data processing

                    Withdraw consent for data processing

                    To exercise any of these rights, please contact us at [email address].

                    7. Changes to This Privacy Policy

                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your personal information.

                    8. Contact Us

                    If you have any questions or concerns about this Privacy Policy, please contact us at:

                    [Your Company Name]
                    [Your Company Address]
                    Email: [email address]
                    Phone: [phone number]                
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { 
    IonPage,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonCardTitle

 } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
</script>