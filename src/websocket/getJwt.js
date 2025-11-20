export async function getJwt() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) return null;

    return await response.text(); // JWT String
  } catch (err) {
    console.error("JWT Fetch Error:", err);
    return null;
  }
}
