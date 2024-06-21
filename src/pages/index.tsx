import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>FairLauncher.fun</title>
        <meta
          name="description"
          content="FairLauncher.fun is a platform designed to provide a fair and transparent launch mechanism for anti-bot and better bot resistance memecoins (Token-2022) on the Solana blockchain."
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
