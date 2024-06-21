/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fairlauncher.fun.json`.
 */
export type Basic = {
  address: '6j7Px9otU45PLLXpmM3W6YDAbNUUHDK7Puf8PLfBTKCq';
  metadata: {
    name: 'fairlauncher.fun';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'fairlauncher.fun';
      discriminator: [203, 194, 3, 150, 228, 58, 181, 62];
      accounts: [];
      args: [];
    }
  ];
};
