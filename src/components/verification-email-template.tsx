import VerificationEmailTemplateProps from '@/types/VerificationEmailTemplateProps'
import pkg from '../../package.json'
import { Html, Head, Body, Container, Heading, Text, Button, Font, Section } from '@react-email/components';



export default function VerificationEmail({ username, verificationCode, redirectURL }: VerificationEmailTemplateProps) {
    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
                <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
                    <h2 style={{ color: '#333' }}>Hello, {username}!</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        Please use the following code to verify your account:
                    </p>
                    <h3 style={{ fontSize: '24px', color: '#4CAF50', fontWeight: 'bold' }}>
                        {verificationCode}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#777' }}>
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                    <Button
                    //At API consumer side there shoud be a page route with /verify/[username]...
                        href={`${redirectURL}`}
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            padding: '10px 20px',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                        }}
                    >
                        Verify Your Account
                    </Button>
                    <Text style={{ fontSize: '14px', color: '#777' }}>
                        Best regards, <br />
                        {pkg.name} Team
                    </Text>
                </Section>
            </Body>
        </Html>
    );
}