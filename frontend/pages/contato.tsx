import type { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Footer from "../components/footer";
import Header from "../components/header";
import Layout from "../components/layout";
import { Container, InputArea, ErrorArea, Title, Input, TextArea, Button, Loading, LoadingAnimation } from "../styles/contato.module";

const Contato: NextPage = () => {
  interface formData {
    name: string;
    email: string;
    subject: string;
    message: string;
    term: boolean;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Informe um nome"),
    email: Yup.string().required("Informe um e-mail").email("E-mail inválido"),
    subject: Yup.string().required("Informe um assunto para a mensagem"),
    message: Yup.string().required("Escreva uma mensagem").min(10, "A mensagem deve conter pelo menos 10 digitos"),
    term: Yup.boolean().isTrue("Aceite os termos de privacidade"),
  });

  const { register, handleSubmit, formState, reset } = useForm<formData>({ resolver: yupResolver(validationSchema) });
  const { errors, isSubmitting } = formState;

  const onSubmit = handleSubmit(async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(console.log(JSON.stringify(data), reset()));
      }, 2000);
    });
  });

  return (
    <>
      <Head>
        <title>Entre em Contato Conosco</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="Entre em contato com a Goede Assessoria e tire suas dúvidas" />
        <meta property="og:title" content="Entre em Contato Conosco" />
        <meta property="og:description" content="Entre em contato com a Goede Assessoria e tire suas dúvidas" />
        <meta property="og:url" content="https://goedeassessoria.com.br/contato" />
      </Head>

      <main>
        <Header />
        <Layout>
          <Container onSubmit={onSubmit}>
            <Title>CONTATO</Title>
            <Input type="text" placeholder="Nome Completo" maxLength={50} {...register("name", { required: true })} />
            <ErrorArea>{errors.name?.message}</ErrorArea>
            <Input type="email" placeholder="E-mail" maxLength={60} {...register("email", { required: true })} />
            <ErrorArea>{errors.email?.message}</ErrorArea>
            <Input type="text" placeholder="Assunto" maxLength={50} {...register("subject", { required: true })} />
            <ErrorArea>{errors.subject?.message}</ErrorArea>
            <TextArea placeholder="Mensagem" maxLength={200} {...register("message", { required: true })} />
            <ErrorArea>{errors.message?.message}</ErrorArea>
            <InputArea>
              <Input type="checkbox" {...register("term", { required: true })} />
              Aceito e dou o consentimento para o tratamento de meus dados pessoais com a finalidade de manter contato com a controladora para assuntos diversos.
            </InputArea>
            <ErrorArea>{errors.term?.message}</ErrorArea>
            {isSubmitting ? (
              <Loading>
                <LoadingAnimation />
              </Loading>
            ) : (
              <Button type="submit">Enviar</Button>
            )}
          </Container>
        </Layout>
        <Footer />
      </main>
    </>
  );
};

export default Contato;
