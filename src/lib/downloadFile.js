export default function downloadFile(uri, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.target = "_blank";
  link.click();
}
