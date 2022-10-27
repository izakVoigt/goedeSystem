import type { NextPage } from "next";
import Head from "next/head";

import Footer from "../../components/footer";
import Header from "../../components/header";
import Layout from "../../components/layout";

const Lgpd: NextPage = () => {
  return (
    <>
      <Head>
        <title>LGPD - Lei Geral de Proteção de Dados</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="LGPD - Lei Geral de Proteção de Dados" />
        <meta property="og:title" content="LGPD - Lei Geral de Proteção de Dados" />
        <meta property="og:description" content="LGPD - Lei Geral de Proteção de Dados" />
        <meta property="og:url" content="https://goedeassessoria.com.br/lgpd" />
      </Head>

      <main>
        <Header />
        <Layout>
          <h1>LGPD</h1>
        </Layout>
        <Footer />
      </main>
    </>
  );
};

export default Lgpd;
