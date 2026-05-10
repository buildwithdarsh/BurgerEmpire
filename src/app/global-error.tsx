"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          backgroundColor: "#FAF8F4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "4.5rem",
            fontWeight: 900,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Oops!
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#4B5563",
            marginBottom: "2rem",
            textAlign: "center",
            maxWidth: "28rem",
          }}
        >
          Something went wrong. Don&apos;t worry, our burgers are still fresh.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#D46E1F",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "0.75rem",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
