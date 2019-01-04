export function humanErrorMessage(error) {
  if (error.status === 404) {
    return "404: Record not found";
  }

  if (error.message === "Failed to fetch") {
    return "No internet connection.";
  }

  return error.message;
}
