export function humanErrorMessage(error) {
  if (error.message === "Failed to fetch") {
    return "No internet connection.";
  }

  return error.message;
}
