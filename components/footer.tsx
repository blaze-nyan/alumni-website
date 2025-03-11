import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">
              RIC Alumni Network
            </h3>
            <p className="text-sm text-muted-foreground">
              Connecting graduates and building a stronger community.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-primary">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-primary">
                  Alumni Directory
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} RIC Alumni Network. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
