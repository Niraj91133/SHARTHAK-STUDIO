import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | Sharthak Studio",
    description: "Manage your website content.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-root selection:bg-white selection:text-black min-h-screen bg-[#0a0a0a]">
            {children}
        </div>
    );
}
