import process from "node:process";
import { createLibp2p } from "libp2p";
import { TCP } from "@libp2p/tcp";
import { Noise } from "@chainsafe/libp2p-noise";
import { Mplex } from "@libp2p/mplex";
import { multiaddr } from "multiaddr";

const node = await createLibp2p({
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/0"],
  },
  transports: [new TCP()],
  connectionEncryption: [new Noise()],
  streamMuxers: [new Mplex()],
});
// Start libp2p
await node.start();
console.log("libp2p has started");

// Print listening addresses
console.log("Listening on addresses:");
node.getMultiaddrs().forEach((addr) => {
  console.log(addr.toString());
});

//   Ping peer if received multiaddr
if (process.argv.length >= 3) {
  const ma = multiaddr(process.argv[2]);
  console.log(`Pinging remote peer at ${process.argv[2]}`);
  const latency = await node.ping(ma);
  console.log(`Pinged ${process.argv[2]} in ${latency}ms`);
} else {
  console.log("No remote peer access given, skipping ping");
}

// Stop libp2p
const stop = async () => {
  await node.stop();
  console.log("libp2p has stopped");
  process.exit(0);
};

process.on("SIGTERM", stop);
process.on("SIGINT", stop);
