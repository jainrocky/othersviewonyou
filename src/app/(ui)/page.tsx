import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Header Section */}
      <header className="w-full max-w-4xl text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to OthersViewOnYou</h1>
        <p className="mt-4 text-lg text-gray-600">
          Send messages anonymously and securely without revealing your identity.
        </p>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Fast and Secure</h2>
          <p className="mt-2 text-gray-600">
            We prioritize your privacy and security, ensuring your messages remain completely anonymous.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800">User-Friendly</h2>
          <p className="mt-2 text-gray-600">
            An easy-to-use interface designed to provide a seamless messaging experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Completely Free</h2>
          <p className="mt-2 text-gray-600">
            Enjoy all features without any cost—because anonymity shouldn’t come with a price tag.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800">No Signup Required</h2>
          <p className="mt-2 text-gray-600">
            Start sending messages instantly without the hassle of creating an account.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="w-full max-w-4xl mt-12 text-center">
        <h3 className="text-xl font-medium text-gray-800">
          Ready to get onboarded to receive other views for you anonymously?
        </h3>
        <div className="mt-4">
          <Link href="/sign-up">
            <Button variant="outline" size="lg">
              Get Started
            </Button></Link>
        </div>
      </div>
    </div>
  )
}