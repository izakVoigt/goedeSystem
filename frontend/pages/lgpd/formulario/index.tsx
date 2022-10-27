import type { NextPage } from "next";
import Head from "next/head";

import Footer from "../../../components/footer";
import Header from "../../../components/header";
import Layout from "../../../components/layout";

const Formulario: NextPage = () => {
  return (
    <>
      <Head>
        <title>Formulário do Titular</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="Formulário para que o titular dos dados possa solicitar os seus dados que tenhamos armazenado" />
        <meta property="og:title" content="Formulário do Titular" />
        <meta property="og:description" content="Formulário para que o titular dos dados possa solicitar os seus dados que tenhamos armazenado" />
        <meta property="og:url" content="https://goedeassessoria.com.br/lgpd/formulario" />
      </Head>

      <main>
        <Header />
        <Layout>
          <h1>LGPD Formulario</h1>
        </Layout>
        <Footer />
      </main>
    </>
  );
};

export default Formulario;
