import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Fairlauncher.fun</title>
        <meta
          name="description"
          content="Functionality"
        />
      </Head>
      <BasicsView />
    </div>
  );
};

export default Basics;
