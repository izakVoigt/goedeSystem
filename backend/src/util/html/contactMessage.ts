const contactMessage = (name: string, email: string, phone: string, subject: string, message: string) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        table {
          font-family: tahoma, arial, sans-serif;
          border-collapse: collapse;
          min-width: 600px;
          max-width: 1200px;
        }
  
        td,
        th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td>
            <h3>Dados para contato</h3>
          </td>
        </tr>
        <tr>
          <td>
            <p>Nome: ${name}</p>
            <p>E-mail: <a href="mailto:${email}">${email}</a></p>
            <p>Telefone: ${phone}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Assunto: <strong>${subject}</strong></p>
            <p>Mensagem:</p>
            <p>${message}</p>
            <br />
            <p>
              <strong
                >${name} aceitou e deu consentimento para o tratamento de seus dados pessoais com a finalidade de manter contato com a controladora para assuntos diversos.
              </strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>  
  `;
};

export default contactMessage;
