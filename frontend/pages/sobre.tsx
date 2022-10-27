import type { NextPage } from "next";
import Head from "next/head";

import Footer from "../components/footer";
import Header from "../components/header";
import Layout from "../components/layout";

const Sobre: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sobre a Goede Assessoria</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="Sobre a Goede Assessoria" />
        <meta property="og:title" content="Sobre" />
        <meta property="og:description" content="Sobre a Goede Assessoria" />
        <meta property="og:url" content="https://goedeassessoria.com.br/sobre" />
      </Head>

      <main>
        <Header />
        <Layout>
          <h1>Sobre</h1>
        </Layout>
        <Footer />
      </main>
    </>
  );
};

export default Sobre;
