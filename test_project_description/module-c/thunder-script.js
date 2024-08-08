if (String(tc.response.status).startsWith("2")) {
  tc.setVar("token", tc.response.json.token, "local")
}