import type { NextPage } from "next";
import Head from "next/head";

import Footer from "../components/footer";
import Header from "../components/header";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Goede Assessoria Contábil</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="Há 35 anos, inovando o jeito contabilista de ser!" />
        <meta property="og:title" content="Goede Assessoria Contábil" />
        <meta property="og:description" content="Há 35 anos, inovando o jeito contabilista de ser!" />
        <meta property="og:url" content="https://goedeassessoria.com.br/" />
      </Head>

      <main>
        <Header />
        <Layout>
          <h1>Home</h1>
        </Layout>
        <Footer />
      </main>
    </>
  );
};

export default Home;
