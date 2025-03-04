import { create } from "ipfs-http-client";
const ipfs = create({ url: "http://localhost:5001" });
async function testIPFS() {
    const { cid } = await ipfs.add("Hello, IPFS!");
    console.log("Added file CID:", cid.toString());
}
testIPFS().catch(console.error);
