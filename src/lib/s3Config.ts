// lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
    region: 'sa-east-1',
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadParaS3(arquivo: File) {
    const nomeAleatorio = `${uuidv4()}-${arquivo.name}`;
    const caminho = `uploads/${nomeAleatorio}`;

    const arrayBuffer = await arquivo.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_STORAGE_BUCKET_NAME!,
        Key: caminho,
        Body: buffer,
        ContentType: arquivo.type,
    });

    await s3.send(command);

    return {
        nome: nomeAleatorio,
        caminho,
    };
}

export async function gerarLinkTemporario(caminho: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_STORAGE_BUCKET_NAME!,
        Key: caminho,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1h
    return url;
}
