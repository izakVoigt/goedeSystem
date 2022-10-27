import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="content-type" content="text/html" />
          <meta name="creator" content="Izak Voigt" />
          <meta name="author" content="Goede Assessoria Contabil LTDA" />
          <meta name="robots" content="index, follow" />
          <meta property="og:locale" content="pt_BR" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Goede Assessoria Contabil" />
          <link rel="canonical" href="https://goedeassessoria.com.br" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Yanone+Kaffeesatz:wght@400;700&display=swap" rel="stylesheet" />
          <link rel="icon" href="favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
