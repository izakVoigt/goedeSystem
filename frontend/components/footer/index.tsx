import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Container, FooterArea, ItemArea, Menu, MenuItem, MenuTitle, SocialMidiaArea } from "./styles";

const Footer = () => {
  return (
    <Container>
      <FooterArea>
        <ItemArea>
          <Image src="/logoIcon.svg" alt="Goede Assessoria Contábil" layout="intrinsic" height="60px" width="60px" loading="lazy" />
          <br />
          Goede Assessoria Contábil 2022
          <br />
          Todos os direitos reservados
        </ItemArea>
        <Menu>
          <MenuTitle>MENU</MenuTitle>
          <MenuItem>
            <Link href="/">Home</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/sobre">Sobre</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/lgpd">LGPD</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/contato">Contato</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/trabalhe-conosco">Trabalhe Conosco</Link>
          </MenuItem>
          <MenuItem>
            <a href="https://onvio.com.br/" target="_blank" rel="noreferrer">
              Cliente
            </a>
          </MenuItem>
          <MenuItem>
            <Link href="/login">Colaborador</Link>
          </MenuItem>
        </Menu>
        <Menu>
          <MenuTitle>LGPD</MenuTitle>
          <MenuItem>
            <Link href="/lgpd/formulario">Formulário do Titular</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/lgpd/privacidade">Aviso de Privacidade</Link>
          </MenuItem>
        </Menu>
        <Menu>
          <MenuTitle>ATENDIMENTO</MenuTitle>
          <MenuItem>
            Horário de Atendimento:
            <br />
            07:45 - 12:00 e 13:15 - 17:45
            <br />
            Segunda a Sexta
          </MenuItem>
          <MenuItem>
            Telefone:
            <br />
            (47) 3387-2474
          </MenuItem>
          <MenuItem>
            E-mail:
            <br />
            <Link href="mailto:contato@goedeassessoria.com.br">contato@goedeassessoria.com.br</Link>
          </MenuItem>
        </Menu>
      </FooterArea>
      <SocialMidiaArea>
        <a href="https://www.facebook.com/goedeassessoria/" target="_blank" rel="noreferrer">
          <FacebookIcon />
        </a>
        <a href="https://www.instagram.com/goedeassessoria_/" target="_blank" rel="noreferrer">
          <InstagramIcon />
        </a>
        <a href="https://www.linkedin.com/company/goede-assessoria-contabil" target="_blank" rel="noreferrer">
          <LinkedInIcon />
        </a>
        <a href="https://api.whatsapp.com/send/?phone=554733872474&text&app_absent=0" target="_blank" rel="noreferrer">
          <WhatsAppIcon />
        </a>
      </SocialMidiaArea>
    </Container>
  );
};

export default Footer;
