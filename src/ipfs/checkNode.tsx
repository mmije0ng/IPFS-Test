import ipfs from "./ipfsClient";

// IPFS 노드가 정상적으로 실행 중인지 확인
export const checkNode = async (): Promise<void> => {
    try {
        const id = await ipfs.id();
        console.log("Connected to IPFS node:", id.agentVersion);
    } catch (error) {
        // console.warn("IPFS Node Check Warning: ", error);
    }
};
