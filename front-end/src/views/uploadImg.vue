<script setup>
import { ref } from "vue";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const file = ref(null);
const uploadStatus = ref("");

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://86abbcb3f3f6b1cb442451569e6e0063.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "6afee48db69af1ad60e0d1c4e92a7c8b",
    secretAccessKey: "4fa0aa6974f957b0185ece45cdb4f939f3d2de3e7b97561f1a1d5d06a18efe31"
  }
});

// Função para selecionar o arquivo
const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

// Função para fazer upload do arquivo
const uploadFile = async () => {
  if (!file.value) {
    uploadStatus.value = "Por favor, selecione um arquivo.";
    return;
  }

  try {
    const uploadParams = {
      Bucket: "libertlla",
      Key: `uploads/${file.value.name}`,
      Body: file.value,
      ContentType: file.value.type
    };

    await s3.send(new PutObjectCommand(uploadParams));

    uploadStatus.value = "Upload concluído com sucesso!";
  } catch (error) {
    console.error("Erro no upload:", error);
    uploadStatus.value = "Erro ao enviar o arquivo.";
  }
};
</script>

<template>
  <div class="upload-container">
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile">Enviar Imagem</button>
    <p>{{ uploadStatus }}</p>
  </div>
</template>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>