import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface EmailTemplateProps {
  email: string;
  name: string;
  token: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  //   email,
  name,
  token,
}) => {
  const resetLink = `${process.env.DNS_FRONT}/auth/new-password?token=${token}`;

  return (
    <Html>
      <Head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background-color: #f3f4f6;
          }
        `}</style>
      </Head>
      <Preview>Redefina sua senha do EstudeAi</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.DNS_FRONT}/images/versao_w.png`}
            width={240}
            height={52}
            alt="EstudeAi"
            style={logo}
          />
          <Heading as="h1" style={h1}>
            Redefinição de Senha
          </Heading>
          <Text style={text}>Olá,${name}</Text>
          <Text style={text}>
            Recebemos uma solicitação para redefinir a senha da sua conta{" "}
            <strong>EstudeAi</strong>. Se você não fez esta solicitação, por
            favor, ignore este email.
          </Text>
          <Text style={textBold}>
            Para redefinir sua senha, siga estas instruções:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Redefinir Senha
            </Button>
          </Section>
          <Text style={text}>
            Ou copie e cole o link abaixo no seu navegador:
          </Text>
          <Text style={link}>{resetLink}</Text>
          <Hr style={hr} />
          <Text style={textBold}>Passos para redefinir sua senha:</Text>
          <ol style={list}>
            <li style={listItem}>
              Clique no botão &quot;Redefinir Senha&quot; acima
            </li>
            <li style={listItem}>
              Você será direcionado para uma página onde poderá criar uma nova
              senha
            </li>
            <li style={listItem}>Digite sua nova senha e confirme-a</li>
            <li style={listItem}>
              Clique em &quot;Salvar&quot; para confirmar sua nova senha
            </li>
          </ol>
          <Text style={textWarning}>
            <strong>Atenção:</strong> Por razões de segurança, este link
            expirará em <strong>1 hora</strong>. Se você precisar de um novo
            link, visite nossa página de redefinição de senha e faça uma nova
            solicitação.
          </Text>
          <Text style={text}>
            Se você tiver alguma dúvida ou precisar de ajuda, não hesite em
            entrar em contato com nossa equipe de suporte.
          </Text>
          <Text style={textBold}>Obrigado por usar o EstudeAi!</Text>
          <Hr style={hr} />
          <Text style={footer}>
            © 2023 EstudeAi. Todos os direitos reservados.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const logo = {
  margin: "0 auto 32px",
  display: "block",
};

const h1 = {
  color: "#0055d4",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "40px",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "28px",
  marginBottom: "16px",
};

const textBold = {
  ...text,
  fontWeight: "bold",
};

const textWarning = {
  ...text,
  backgroundColor: "#fff5f5",
  padding: "12px",
  borderRadius: "4px",
  border: "1px solid #fed7d7",
  color: "#9b2c2c",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0055d4",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  width: "200px",
  padding: "12px 20px",
};

const list = {
  ...text,
  paddingLeft: "24px",
};

const listItem = {
  marginBottom: "12px",
};

const link = {
  color: "#0055d4",
  textDecoration: "underline",
  fontWeight: "bold",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "16px",
};

export default EmailTemplate;
