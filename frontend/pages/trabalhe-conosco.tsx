import type { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Footer from "../components/footer";
import Header from "../components/header";
import Layout from "../components/layout";
import { Container, InputArea, ErrorArea, Title, Input, TextArea, Button, Loading, LoadingAnimation } from "../styles/contato.module";

const Trabalhe: NextPage = () => {
  interface formData {
    name: string;
    email: string;
    phone: string;
    department: string;
    term: boolean;
    file: File;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Informe um nome"),
    email: Yup.string().required("Informe um e-mail").email("E-mail inválido"),
    phone: Yup.string().required("Informe um telefone para contato"),
    department: Yup.string().required("Selecione um departamento"),
    term: Yup.boolean().isTrue("Aceite os termos de privacidade"),
    file: Yup.mixed().test("file", "Selecione um arquivo", (value: File) => {
      if (value.size > 0) {
        return true;
      }
      return false;
    }),
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
        <title>Trabalhe Conosco</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="Trabalhe Conosco" />
        <meta property="og:title" content="Trabalhe Conosco" />
        <meta property="og:description" content="Trabalhe Conosco" />
        <meta property="og:url" content="https://goedeassessoria.com.br/trabalhe-conosco" />
      </Head>

      <main>
        <Header />
        <Layout>
          <Container onSubmit={onSubmit}>
            <Title>TRABALHE CONOSCO</Title>
            <Input type="text" placeholder="Nome Completo" maxLength={50} {...register("name", { required: true })} />
            <ErrorArea>{errors.name?.message}</ErrorArea>
            <Input type="email" placeholder="E-mail" maxLength={60} {...register("email", { required: true })} />
            <ErrorArea>{errors.email?.message}</ErrorArea>
            <InputMask mask="(99) 99999-9999" type="text" placeholder="Celular" {...register("phone", { required: true })} />
            <ErrorArea>{errors.phone?.message}</ErrorArea>
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

export default Trabalhe;
