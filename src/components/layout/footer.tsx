import Link from 'next/link'
import { 
  Home, 
  Search, 
  Grid3X3, 
  FolderOpen, 
  MessageSquare, 
  UserSearch, 
  BookOpen, 
  Plus,
  Info,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  Users,
  Code,
  Bug,
  Lightbulb,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const platformLinks = [
    { href: '/puzzles/browse', label: 'Browse Puzzles', icon: Grid3X3 },
    { href: '/collections', label: 'Collections', icon: FolderOpen },
    { href: '/community', label: 'Activity Feed', icon: MessageSquare },
    { href: '/discover', label: 'User Directory', icon: UserSearch },
    { href: '/my-puzzles', label: 'My Puzzles', icon: BookOpen },
    { href: '/puzzles/add', label: 'Add Puzzle', icon: Plus },
  ]

  const supportLinks = [
    { href: '/about', label: 'About Puzzlr', icon: Info },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/help', label: 'Help Center', icon: HelpCircle },
    { href: '/community-guidelines', label: 'Community Guidelines', icon: Users },
    { href: '/contact', label: 'Contact Us', icon: Mail },
  ]

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy', icon: Shield },
    { href: '/terms', label: 'Terms of Service', icon: FileText },
    { href: '/cookies', label: 'Cookie Policy', icon: FileText },
  ]

  const developerLinks = [
    { href: '/api-docs', label: 'API Documentation', icon: Code },
    { href: '/report-bug', label: 'Submit Bug Report', icon: Bug },
    { href: '/feature-request', label: 'Feature Requests', icon: Lightbulb },
  ]

  const socialLinks = [
    { href: 'https://facebook.com/puzzlr.in', label: 'Facebook', icon: Facebook },
    { href: 'https://twitter.com/puzzlr_in', label: 'Twitter', icon: Twitter },
    { href: 'https://instagram.com/puzzlr.in', label: 'Instagram', icon: Instagram },
    { href: 'https://linkedin.com/company/puzzlr', label: 'LinkedIn', icon: Linkedin },
  ]

  return (
    <footer className="bg-white/95 backdrop-blur-md border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Platform Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
                  >
                    <link.icon className="w-3 h-3" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
                  >
                    <link.icon className="w-3 h-3" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Legal</span>
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
                  >
                    <link.icon className="w-3 h-3" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Developer</span>
            </h3>
            <ul className="space-y-3">
              {developerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
                  >
                    <link.icon className="w-3 h-3" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Connect</span>
            </h3>
            <div className="space-y-3">
              {/* Social Media Links */}
              <div className="flex flex-col space-y-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
                  >
                    <social.icon className="w-3 h-3" />
                    <span className="text-sm">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Brand & Copyright */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">🧩</span>
                </div>
                <span className="font-bold text-lg text-gray-900">PUZZLR</span>
              </Link>
              <span className="text-gray-500 text-sm">
                © {currentYear} Puzzlr. All rights reserved.
              </span>
            </div>

            {/* Tagline */}
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                The social platform for puzzle enthusiasts
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Discover, track, and share your jigsaw puzzle journey
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}