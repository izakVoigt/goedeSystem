import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import useWindowDimensions from "../../hooks/useWindowDimentions";
import { Container, Menu, MenuItem } from "./styles";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <Container>
      {width !== undefined && width <= 400 ? (
        <Image src="/logoIcon.svg" alt="Goede Assessoria Contábil" layout="intrinsic" height="40px" width="50px" loading="lazy" />
      ) : (
        <Image src="/logoWhite.svg" alt="Goede Assessoria Contábil" layout="intrinsic" height="40px" width="200px" loading="lazy" />
      )}
      {activeMenu ? <CloseIcon onClick={() => setActiveMenu(!activeMenu)} /> : <MenuIcon onClick={() => setActiveMenu(!activeMenu)} />}
      <Menu activeMenu={activeMenu}>
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
    </Container>
  );
};

export default Header;
