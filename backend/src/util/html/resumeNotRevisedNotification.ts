const resumesNotRevisedNotification = (resumesCount: number) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          padding: 15px;
        }
        p {
          margin: 10px 0;
        }
        a {
          margin: 40px 0;
          padding: 10px;
          border-radius: 5px;
          background-color: #489b6c;
          color: #fff;
          font-size: 16px;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      ${
        resumesCount >= 2
          ? "<p>Foram cadastrados ${resumesCount} novos currículos que não foram vizualizados.</p>"
          : "<p>Foi cadastrado ${resumesCount} novo currículo que não foi vizualizado.</p>"
      }
      <a href="https://goedeassessoria.com.br/curriculos?order=new&revised=false">Clique aqui para vizualizar</a>
    </body>
  </html>  
  `;
};

export default resumesNotRevisedNotification;
