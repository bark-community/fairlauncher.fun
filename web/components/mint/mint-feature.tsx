'use client';

import React, { useState } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID, createMint } from '@solana/spl-token';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import copy from 'copy-to-clipboard';

const MintFeatures: React.FC = () => {
  const [tokenDetails, setTokenDetails] = useState({
    name: '',
    symbol: '',
    decimals: 0,
    taxFees: 0,
    bearingRate: 0,
    harvestAddress: '',
    description: '',
    supply: 0,
    metadataUrl: '',
    logoUrl: '',
  });

  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenDetails({
      ...tokenDetails,
      [name]: name === 'decimals' || name === 'taxFees' || name === 'bearingRate' || name === 'supply' ? Number(value) : value,
    });
  };

  const generateKeypair = () => {
    const newKeypair = Keypair.generate();
    setKeypair(newKeypair);
  };

  const copyToClipboard = (text: string) => {
    copy(text);
    alert('Copied to clipboard!');
  };

  const createToken = async () => {
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const mint = await createMint(
        connection,
        keypair!, // Fee payer
        keypair!.publicKey, // Mint authority
        null, // Freeze authority
        tokenDetails.decimals, // Decimals
        TOKEN_2022_PROGRAM_ID // Program ID
      );

      console.log(`Tax Token created: ${mint.toBase58()}`);
      alert(`Token-2022 created successfully: ${mint.toBase58()}`);
    } catch (error) {
      console.error('Error creating 2022-token:', error);
      alert('Failed to create 2022-token.');
    }
  };

  return (
    <section id="mint-features" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Minting Features</h2>
        <p className="text-lg text-gray-700 text-center mb-12">
          Fill in the details below to create your memecoin on the Solana blockchain. All tokens will be created using the TOKEN_2022_PROGRAM_ID.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: 'Token Name', name: 'name', type: 'text' },
            { label: 'Token Symbol', name: 'symbol', type: 'text' },
            { label: 'Decimals', name: 'decimals', type: 'number' },
            { label: 'Tax Fees (%)', name: 'taxFees', type: 'number' },
            { label: 'Instant Bearing Rate', name: 'bearingRate', type: 'number' },
            { label: 'Wallet Address to Harvest Fees', name: 'harvestAddress', type: 'text' },
            { label: 'Description', name: 'description', type: 'text' },
            { label: 'Mint Token Supply', name: 'supply', type: 'number' },
            { label: 'Metadata URL', name: 'metadataUrl', type: 'text' },
            { label: 'Logo URL', name: 'logoUrl', type: 'text' },
          ].map((field, index) => (
            <div key={index} className="p-6 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
              <label className="block mb-2 font-bold">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={tokenDetails[field.name as keyof typeof tokenDetails]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="btn btn-primary mx-2" onClick={generateKeypair}>Generate Keypair</button>
          {keypair && (
            <>
              <div className="mt-4">
                <p className="font-bold">Public Key:</p>
                <p className="break-all">{keypair.publicKey.toBase58()}</p>
                <button className="btn btn-secondary mt-2" onClick={() => copyToClipboard(keypair.publicKey.toBase58())}>Copy Public Key</button>
              </div>
              <div className="mt-4">
                <p className="font-bold">Secret Key:</p>
                <p className="break-all">{keypair.secretKey.toString()}</p>
                <button className="btn btn-secondary mt-2" onClick={() => copyToClipboard(keypair.secretKey.toString())}>Copy Secret Key</button>
              </div>
            </>
          )}
          <div className="mt-8">
            <button className="btn btn-primary" onClick={createToken}>Create Token</button>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Instructions</h3>
          <p className="text-gray-700">
            1. Fill in all the token details above.
            <br />
            2. Generate a keypair and copy the keys if needed. Note that FairLauncher.fun does not hold any user keys.
            <br />
            3. Click "Create Token" to generate your new token on the Solana blockchain.
            <br />
            4. Use the provided Public Key to manage your new token.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MintFeatures;
