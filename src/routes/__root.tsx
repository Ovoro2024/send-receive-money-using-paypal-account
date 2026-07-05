import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/auth/AuthProvider";
import { SplashGate } from "@/components/paypal/SplashGate";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" },
      { title: "PayPal" },
      { name: "description", content: "PayPal Mobile App" },
      { name: "author", content: "PayPal" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "PayPal" },
      { name: "theme-color", content: "#003087" },
      { property: "og:title", content: "PayPal" },
      { property: "og:description", content: "PayPal Mobile App" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "PayPal" },
      { name: "twitter:description", content: "PayPal Mobile App" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1bcc2f97-6dc3-4967-b455-6e21f677f878/id-preview-d497f3d1--f8f570f2-679f-4fcd-b42b-2a3c23ef1c9a.lovable.app-1777876226711.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1bcc2f97-6dc3-4967-b455-6e21f677f878/id-preview-d497f3d1--f8f570f2-679f-4fcd-b42b-2a3c23ef1c9a.lovable.app-1777876226711.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <SplashGate>
        <Outlet />
      </SplashGate>
    </AuthProvider>
  );
}
