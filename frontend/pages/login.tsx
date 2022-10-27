import type { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Footer from "../components/footer";
import Header from "../components/header";
import Layout from "../components/layout";
import { Container, ErrorArea, Title, Input, Button, Loading, LoadingAnimation } from "../styles/login.module";

const Login: NextPage = () => {
  interface formData {
    email: string;
    password: string;
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Informe um e-mail").email("E-mail inválido"),
    password: Yup.string().required("Informe uma senha").min(8, "A senha deve conter pelo menos 8 digitos"),
  });

  const { register, handleSubmit, formState } = useForm<formData>({ resolver: yupResolver(validationSchema) });
  const { errors, isSubmitting } = formState;

  const onSubmit = handleSubmit(async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(console.log(JSON.stringify(data)));
      }, 2000);
    });
  });

  return (
    <>
      <Head>
        <title>Área do Colaborador</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="description" content="Área do Colaborador" />
        <meta property="og:title" content="Área do Colaborador" />
        <meta property="og:description" content="Área do Colaborador" />
        <meta property="og:url" content="https://goedeassessoria.com.br/login" />
      </Head>

      <main>
        <Header />
        <Layout>
          <Container onSubmit={onSubmit}>
            <Title>ÁREA DO COLABORADOR</Title>
            <Input type="email" placeholder="E-mail" {...register("email", { required: true })} />
            <ErrorArea>{errors.email?.message}</ErrorArea>
            <Input type="password" placeholder="Senha" {...register("password", { required: true })} />
            <ErrorArea>{errors.password?.message}</ErrorArea>
            {isSubmitting ? (
              <Loading>
                <LoadingAnimation />
              </Loading>
            ) : (
              <Button type="submit">Entrar</Button>
            )}
          </Container>
        </Layout>
        <Footer />
      </main>
    </>
  );
};

export default Login;
