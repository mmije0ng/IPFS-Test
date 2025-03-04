import { create } from "ipfs-http-client";

// IPFS 클라이언트 생성
const ipfs = create({ url: "http://127.0.0.1:5001" });

export default ipfs;
