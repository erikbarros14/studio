
export function Footer() {
  return (
    <footer className="border-t bg-card py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TrackFit Go. All rights reserved.</p>
        <p className="mt-1">Happy Tracking!</p>
      </div>
    </footer>
  );
}
