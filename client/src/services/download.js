import api from "./axios";

// Fetch a file as a blob (authenticated) and trigger a browser download.
export const downloadBlob = async (url, fallbackName = "file") => {
  const response = await api.get(url, {
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"] || "";
  let filename = fallbackName;

  const match = disposition.match(/filename="?([^"]+)"?/i);
  if (match && match[1]) {
    filename = match[1];
  }

  const blobUrl = window.URL.createObjectURL(response.data);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
};

// Fetch a blob (authenticated) and open it in a new tab (for HTML receipts).
export const openBlobInNewTab = async (url) => {
  const response = await api.get(url, {
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(response.data);
  window.open(blobUrl, "_blank");
};