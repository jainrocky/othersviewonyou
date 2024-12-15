export default function Footer() {
    return (
        <footer className="w-full bg-gray-800 text-gray-200 py-6 mt-10">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} OthersViewOnYou. All rights reserved.</p>
                <p className="mt-2 text-xs text-gray-400">
                    A platform to get anonymous views from others securely and privately.
                </p>
            </div>
        </footer>
    );
}