import Container from "./container";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container className="flex h-16 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Shop Sphere
        </p>

        <p className="text-sm text-muted-foreground">
          Built with Next.js
        </p>
      </Container>
    </footer>
  );
}