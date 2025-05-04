import { useEffect, useRef } from "react";

function GoogleLoginButton({ onLoginSuccess }) {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    /* global google */
    if (window.google && googleButtonRef.current) {
      google.accounts.id.initialize({
        client_id: "872792915542-tdot930v32243olj0gbkidj4lpscc2cc.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: "300",
      });
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
    console.log("✅ idToken:", idToken);

    try {
      const url = new URL("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login-with-google");
      url.searchParams.set("idToken", idToken);
      url.searchParams.set("fcmToken", "web-client-placeholder");

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      });

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        const token = data.data?.accessToken || data.data?.token;
        localStorage.setItem("token", token);
        onLoginSuccess?.(token);
      } else {
        alert(data.message || "Google login failed.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed.");
    }
  };

  return <div ref={googleButtonRef}></div>;
}

export default GoogleLoginButton;
